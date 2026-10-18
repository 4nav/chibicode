import type { Mood } from './dialogue';
import type { ActivitySnapshot } from './tracker';

export function getMood(
    event:string,
    snapshot: ActivitySnapshot
): Mood{
    if(event === 'commit' || event === 'milestone'){
        return 'proud';
    }
    if (snapshot.state === 'away') {
        return 'sleepy';
    }
    if (snapshot.idleSeconds >= 300) {
        return 'playful';
    }
    if (snapshot.sessionSeconds >= 3 * 60 * 60) {
        return 'sleepy';
    }
    if (snapshot.state === 'thinking') {
        return 'supportive';
    }

    if(snapshot.todaySeconds !== undefined && snapshot.todaySeconds >= 2 * 60 * 60){
        return 'proud';
    }
    return 'playful';
}