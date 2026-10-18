import * as vscode from 'vscode';
import { getTodayStats, type TodayStats } from './hackatime';

export type ActivityState = 'coding' | 'thinking' | 'away';

export interface ActivitySnapshot{
    state: ActivityState;
    sessionSeconds: number;
    idleSeconds: number;
    lastEditorActivityAt: number | undefined;
    todaySeconds: number | undefined;
}

const ACTIVE_WINDOW_MS = 60_000;
const STATS_REFRESH_MS = 30_000;

export class ActivityTracker implements vscode.Disposable{
    private readonly startedAt = Date.now();
    private lastEditorActivityAt: number | undefined;
    private state: ActivityState;
    private todayStats: TodayStats | undefined;
    private readonly statusBar: vscode.StatusBarItem;
    private readonly disposables: vscode.Disposable[] = [];
    private readonly timer: ReturnType<typeof setInterval>;
    private readonly statsTimer: ReturnType<typeof setInterval>;
    private refreshInProgress = false;
    private nag1 = false;
    private nag2 = false;

    
    constructor(
    private readonly getHackatimeKey: () => Thenable<string | undefined>, private readonly onStateChange?: (
        previous: ActivityState,
        current: ActivityState) => void, private readonly onIdleThreshold?: (minutes: number) => void, 
        private readonly onMilestone?: (hours: number) => void){
        this.state = vscode.window.state.focused?'thinking':'away';
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

        this.statusBar.show();
        this.disposables.push(this.statusBar);

        this.disposables.push(vscode.window.onDidChangeWindowState(() => {
            this.refresh();
        }),

        vscode.workspace.onDidChangeTextDocument(event => {
            if(event.contentChanges.length > 0){
                this.recordActivity();
            }
        }),

        vscode.window.onDidChangeTextEditorSelection(() => {
            this.recordActivity();
        }),

        vscode.window.onDidChangeTextEditorVisibleRanges(()=>{
            this.recordActivity();
        }),

        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                this.recordActivity();
                }
            })
        );

        this.timer = setInterval(() => {
            this.refresh();
        }, 1000);

        this.refresh(true);
        void this.updateTodayStats();

        this.statsTimer = setInterval(() => {
            void this.updateTodayStats();
        },STATS_REFRESH_MS);
        console.log('ChibiCode: Activity tracker started.');
    }

    private checkIdleReactions():void{
        const snapshot = this.getSnapshot();

        if(snapshot.state === 'coding'){
            this.nag1 = false;
            this.nag2 = false;
            return;
        }
        if (snapshot.state === 'away') {
            return;
        }
        if(snapshot.idleSeconds >= 300 && !this.nag2){
            this.nag2 = true;
            this.onIdleThreshold?.(5);
        }
        else if(snapshot.idleSeconds >= 60 && !this.nag1){
            this.nag1 = true;
            this.onIdleThreshold?.(1);
        }

    }

    private recordActivity(): void {
        this.lastEditorActivityAt = Date.now();
        this.refresh();
    }

    private getState(now: number): ActivityState{
        if(!vscode.window.state.focused){
            return 'away';
        }
        if(this.lastEditorActivityAt !== undefined && now - this.lastEditorActivityAt <= ACTIVE_WINDOW_MS){
            return 'coding';
        }
        return 'thinking';
    } 

    formatDuration(seconds: number):string{
        const hours = Math.floor(seconds/3600);
        const minutes = Math.floor((seconds % 3600)/60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    private refresh(forceLog = false): void{
        const now = Date.now();
        const nextState = this.getState(now);
        const previousState = this.state;
        const changed = nextState !== this.state;

        if (changed || forceLog) {
            console.log(`ChibiCode: Activity state: ${nextState}`);
        }
        this.state = nextState;
        if(changed){
            this.onStateChange?.(previousState, nextState);
        }

        const sessionSeconds = Math.floor((now - this.startedAt)/1000);
        const idleSeconds = Math.floor((now - (this.lastEditorActivityAt ?? this.startedAt))/1000);

        const labels: Record<ActivityState, string> = {
            coding: 'Coding',
            thinking: 'Thinking / idle',
            away: 'Away'
        };

        const todayText = this.todayStats?.text ?? 'Loading...';


        this.statusBar.text = `$(code) ChibiCode: ${labels[this.state]} | Today: ${todayText}`;
        this.statusBar.tooltip = `Hackatime tracked today: ${todayText}\n` + `Tracker runtime: ${this.formatDuration(sessionSeconds)}\n` + `Time since editor activity: ${this.formatDuration(idleSeconds)}`;
        this.checkIdleReactions();
    }

    private async updateTodayStats(): Promise<void> {
        if(this.refreshInProgress){
            return;
        }
        this.refreshInProgress = true;

        try{
            const key = await this.getHackatimeKey();

            if(!key){
                this.todayStats = undefined;
                this.refresh();
                return;
            }
            const stats = await getTodayStats(key);
            if(stats){
                const previousSeconds = this.todayStats?.totalSeconds;

                this.todayStats = stats;

                if(previousSeconds !== undefined){
                    const milestones = [1,2,4];
                    
                    for(const hours of milestones){
                        const threshold = hours * 3600;

                        if(previousSeconds < threshold && stats.totalSeconds >= threshold){
                            this.onMilestone?.(hours);
                            break;
                        }
                    }
                }
            }
            this.refresh();
        } catch(error){
            console.error('ChibiCode: Could not update daily stats:', error);
        }
        finally{
            this.refreshInProgress = false;
        }
    }

    getSnapshot(): ActivitySnapshot {
        const now = Date.now();

        return{
            state: this.getState(now),
            sessionSeconds: Math.floor((now - this.startedAt) / 1000),
            idleSeconds: Math.floor((now - (this.lastEditorActivityAt ?? this.startedAt)) / 1000),
            lastEditorActivityAt: this.lastEditorActivityAt,
            todaySeconds: this.todayStats?.totalSeconds
        };
    }
    dispose(): void {
        clearInterval(this.timer);
        clearInterval(this.statsTimer);

        for(const disposable of this.disposables){
            disposable.dispose();
        }
        console.log('ChibiCode: Activity tracker stopped.');
    }   
}   