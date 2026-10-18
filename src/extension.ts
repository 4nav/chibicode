import * as vscode from 'vscode';
import {randomBytes} from 'crypto';
import {pick} from './dialogue';
import { getTodayStats,clearHackatimeCache,getWeeklyStats,getDailySummaries } from './hackatime';
import { ActivityTracker } from './tracker';
import type { ActivityState } from './tracker';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('ChibiCode: Activated');

	const getHackatimeKey = () =>
		context.secrets.get('chibicode.hackatimeApiKey');

	const provider = new ChibiCodeProvider(
		context.extensionUri,
		getHackatimeKey
	);

	const tracker = new ActivityTracker(
		getHackatimeKey,
		(previous, current) => {
			provider.handleActivityChange(previous, current);
		}, 
		minutes => {provider.react(minutes === 1 ? 'idleNag' : 'idleEscalation');},
		hours => { provider.handleMilestone(hours);}

	);

	context.subscriptions.push(tracker);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('chibicode-view', provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'chibicode.setHackatimeKey',
			async() => {
				const key = await vscode.window.showInputBox({
					title: 'Configure Hackatime',
					prompt: 'Paste your Hackatime API key',
					password: true,
					ignoreFocusOut: true
				});

				if(key === undefined){
					return;
				}

				if(!key.trim()){
					vscode.window.showErrorMessage(
						'Api Key cant be empty'
					);
					return;
				}
				await context.secrets.store(
					'chibicode.hackatimeApiKey',
					key.trim()
				);	
				clearHackatimeCache();
				vscode.window.showInformationMessage(
					'Hackatime API key saved.'
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'chibicode.testHackatime',
			async() => {
				const key = await context.secrets.get(
					'chibicode.hackatimeApiKey'
				);

				if(!key){
					vscode.window.showWarningMessage(
                    	'Configure your Hackatime API key first.'
                	);
					return;
				}

            const today = await getTodayStats(key);
            console.log('ChibiCode: Today response:', today);

            const weekly = await getWeeklyStats(key);
            console.log('ChibiCode: Weekly response:', weekly);

            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 6);

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const summaries = await getDailySummaries(
                key,
                formatDate(start),
                formatDate(end)
            );

            console.log(
                'ChibiCode: Daily summaries response:',
                summaries
            );

            vscode.window.showInformationMessage(
                `Today: ${today?.text ?? 'Failed'} | ` +
                `Weekly: ${weekly
                    ? `${Math.round(weekly.totalSeconds / 3600 * 10) / 10} hours`
                    : 'Failed'} | ` +
                `Daily summaries: ${summaries?.length ?? 'Failed'} days`
            	);
			}
		)
	);

	void setupGitIntegration(context, provider);
}

const EXPRESSION_MAP: Record<string, { closed: string; open: string }> = {
	neutral: {
		closed: 'neutral_closed.png',
		open: 'neutral_open.png'
	},

	happy: {
		closed: 'closed_eyes_happy.png',
		open: 'happy_closed_eyes.png'
	},

	angry: {
		closed: 'angry_closed.png',
		open: 'angry_open.png'
	},

	crying: {
		closed: 'crying_closed.png',
		open: 'crying_open.png'
	},

	hmph: {
		closed: 'closed_eyes_angry.png',
		open: 'closed_eyes_angry.png'
	},

	flustered: {
		closed: 'closed_eyes_sad.png',
		open: 'closed_eyes_sad.png'
	}
};

async function setupGitIntegration(context: vscode.ExtensionContext, provider: ChibiCodeProvider): Promise<void>{
	try{
		const ext = vscode.extensions.getExtension('vscode.git');
		if(!ext){
			console.warn('ChibiCode: VS Code Git extension not found.');
            return;
		}
		const gitExports = ext.isActive ? ext.exports : await ext.activate();
		console.log('ChibiCode: Git extension active:', ext.isActive);
		console.log('ChibiCode: Git exports:', gitExports);
		console.log('ChibiCode: getAPI type:', typeof gitExports?.getAPI);
		if(!gitExports || typeof gitExports.getAPI !== 'function'){
			console.warn('ChibiCode: Git API unavailable.');
			return;
		}

		const api = gitExports.getAPI(1);
		console.log('ChibiCode: Git API connected');
		console.log('ChibiCode: Repositories:', api.repositories.length);
		const tracked = new Map<any, vscode.Disposable>();

		function trackRepository(repo: any): void{
			if(tracked.has(repo)){
				return;
			}

			console.log(
				'ChibiCode: Tracking repository:',
				repo.rootUri.fsPath
			);

			let prevCommit = repo.state.HEAD?.commit;
			let prevBranch = repo.state.HEAD?.name;

			const disposable = repo.state.onDidChange(() => {
				const curCommit = repo.state.HEAD?.commit;
				const curBranch = repo.state.HEAD?.name;

				if(curCommit && curCommit !== prevCommit && curBranch === prevBranch){
					console.log('ChibiCode: Commit detected!');
            		provider.react('commit', true);
				}
				prevCommit = curCommit;
				prevBranch = curBranch;
			});

			tracked.set(repo, disposable);
			context.subscriptions.push(disposable);
		}

		//look for activity in a new repo
		context.subscriptions.push(api.onDidOpenRepository((repository: any) => {
			console.log('ChibiCode: Repository opened:', repository.rootUri.fsPath);
			trackRepository(repository);
		}));

		//stop looking when a repo closes
		context.subscriptions.push(api.onDidCloseRepository((repository:any) => {
			tracked.get(repository)?.dispose();
			tracked.delete(repository);
		}));

		for (const repository of api.repositories) {
            trackRepository(repository);
        }
	}
	catch(error){
		console.error('ChibiCode: Could not initialize Git integration.', error);
	}

}

class ChibiCodeProvider implements vscode.WebviewViewProvider{
	constructor(private readonly extensionUri: vscode.Uri, private readonly getHackatimeKey: () => Thenable<string | undefined>) {}

	private view?: vscode.WebviewView;
	private greeted = false;
	private lastReaction = 0;
	private cooldown = 8000; // 8 seconds
	private pendingReaction?: {
		expression: string;
		text: string;
	};
	private webviewReady = false;

	resolveWebviewView(webviewView: vscode.WebviewView):void{
		this.view = webviewView;
		this.webviewReady = false;
		const webview = webviewView.webview;

		webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.extensionUri, 'media')
			]
		};

		webview.onDidReceiveMessage(msg => {
			if(msg.type === 'ready'){
				console.log('ChibiCode: Webview ready signal received');
				this.webviewReady = true;

				if(this.pendingReaction){
					const {expression, text} = this.pendingReaction;
					this.pendingReaction = undefined;
					this.say(expression, text);
				}
				else if(!this.greeted){
					this.greeted = true;
					this.react('sessionStart');
				}
			}
		});

		webviewView.onDidChangeVisibility(() => {
			console.log(
				'ChibiCode: Webview visibility:',
				webviewView.visible
			);
		});


		webviewView.onDidDispose(() => {
			this.view = undefined;
			this.webviewReady = false;
		});

		webview.html = this.getHtml(webview);
	}

	handleActivityChange(
		previous: ActivityState,
		current: ActivityState
	): void {
		if (current === 'coding' && previous !== 'coding') {
			this.react('returnToWork');
		}
	}

	handleMilestone(hours: number): void{
		const lines: Record<number, {expression: string, text:string}> = {
			1: {
				expression: 'happy',
				text: 'One hour of coding today! That is a solid start. 🎉'
        	},
			2: {
				expression: 'happy',
				text: "Two hours today! You're building real momentum! ✨"
        	},
			4: {
				expression: 'happy',
				text: "Four hours of coding today! That's a serious session. 🎉"
			}
		};
		const line  = lines[hours];

		if (line) {
			const now = Date.now();

			if (now - this.lastReaction < this.cooldown) {
				return;
			}

			this.lastReaction = now;
			this.say(line.expression, line.text);
		}
	}


	say(expression: string, text:string): void{
		console.log('ChibiCode: say() called:', expression, text);
		console.log('ChibiCode: Webview exists:', !!this.view);
		console.log('ChibiCode: Webview ready:', this.webviewReady);


		if (!this.view || !this.webviewReady) {
			this.pendingReaction = { expression, text };
			console.log('ChibiCode: Reaction queued:', text);
			return;
		}

		void this.view.webview.postMessage({expression, text}).then(delivered => {console.log('ChibiCode: Message delivered:', delivered);
			if(!delivered){
				this.pendingReaction = { expression, text };
				this.webviewReady = false;
				console.log('ChibiCode: Message queued after failed delivery');
			}
		});
	}



	react(event: string, bypassCooldown = false): void{
		if(event === 'sessionStart'){
			void this.reactSessionStart(bypassCooldown);
			return;
		}
		this.reactFromBucket(event,bypassCooldown);
	}
	private reactFromBucket(event: string, bypassCooldown = false, context: { today?: string } = {}): void{
		const now =  Date.now();

		if(!bypassCooldown && now - this.lastReaction < this.cooldown){
			return;
		}

		const line = pick(event, context);

		this.lastReaction = now;
		this.say(line.expression,line.text);
	}

	private async reactSessionStart(bypassCooldown = false): Promise<void> {
		const now = Date.now();
		if (!bypassCooldown && now - this.lastReaction < this.cooldown) {
			return;
		}
		let bucket = 'sessionStart';
		let today: string | undefined;

		try{
			const key = await this.getHackatimeKey();

			if(key){
				let timeout: ReturnType<typeof setTimeout> | undefined; 

				try{
					const timeoutPromise = new Promise<undefined>(resolve => {timeout = setTimeout(() => resolve(undefined), 1500);});
					const stats = await Promise.race([getTodayStats(key),timeoutPromise]);

					if(stats){
						if(stats.totalSeconds < 300){
							bucket = 'sessionStart';
						}
						else if(stats.totalSeconds < 3600){
							bucket = 'sessionStartLow';
						}
						else if(stats.totalSeconds < 7200){
							bucket = 'sessionStartHigh';
						}
						else{
							bucket = 'sessionStartLong';
						}
					}
				}
				finally{
					if (timeout !== undefined) {
						clearTimeout(timeout);
					}
				}
			}
		} catch(error){
			console.error('ChibiCode: Could not load session stats:', error);
		}
		this.reactFromBucket(bucket, bypassCooldown, { today });
	}

	private getHtml(webview: vscode.Webview): string {
		const spriteMap: Record<string, {closed : string; open: string}> = {};

		for(const [expression, files] of Object.entries(EXPRESSION_MAP)){
			spriteMap[expression] = {
				closed: webview.asWebviewUri(
					vscode.Uri.joinPath(this.extensionUri, 'media', files.closed)
				).toString(),
				open: webview.asWebviewUri(
					vscode.Uri.joinPath(this.extensionUri, 'media', files.open)
				).toString()
			};
		} 


		const spriteUri = spriteMap.neutral.closed;
		const nonce = randomBytes(16).toString('base64');

		return `<!DOCTYPE html>
		<html lang = "en">
		<head>
			<meta charset = "UTF-8">
			<meta name = "viewport" content = "width=device-width, initial-scale = 1.0">
			<meta http-equiv="Content-Security-Policy"
				content="default-src 'none'; img-src ${webview.cspSource} https:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
				
				<title>ChibiCode</title>

				<style>
					:root{
						--bubble-bg: #fff0f6;
						--bubble-text: #D02C55;
						--bubble-border: #e58bb5;
					}
					html {
						height: 100%;
					}

					body{
						margin: 0;
						min-height: 100vh;
						box-sizing: border-box;
						padding: 20px 20px 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: flex-end;
						background: var(--vscode-sideBar-background);
						color: var(--vscode-sideBar-foreground);
						font-family: var(--vscode-font-family);
					}

					img{
						display: block;
						width: 100%;
						max-width: 100%;
						height: auto;
						object-fit: contain;
					}

					.bubble{
						position: relative;
						box-sizing: border-box;
						width: 100%;
						max-width: 280px;
						min-height: 76px;
						padding: 24px 14px 14px;
						margin-bottom: 12px;

						background: var(--bubble-bg);
						color: var(--bubble-text);
						border: 1px solid var(--bubble-border);
						border-radius: 12px;

						font-size: 13px;
						line-height: 1.5;
						overflow-wrap: anywhere;

						opacity: 1;
						transition: opacity 0.3s ease;
					}

					.bubble.hidden{
						opacity: 0;
						pointer-events: none;
					}

					.bubble::after{
						content: "";
						position: absolute;
						bottom: -8px;
						left: 50%;

						width: 14px;
						height: 14px;

						background: var(--bubble-bg);
						border-right: 1px solid var(--bubble-border);
						border-bottom: 1px solid var(--bubble-border);

						transform: translateX(-50%) rotate(45deg);
					}
					</style>
		</head>
		<body>
			<div class="bubble hidden">
				<div id="message">Ready to code?</div>
			</div>

			<img id="sprite" src="${spriteUri}" alt="ChibiCode">

			<script nonce="${nonce}">	
			let hideTimer;
			let typingTimer;
			
			const sprites = ${JSON.stringify(spriteMap)};
			const sprite = document.getElementById('sprite');

			for(const expression of Object.values(sprites)){
				for(const url of Object.values(expression)){
					const img = new Image();
					img.src = url;
				}
			}

			const vscode = acquireVsCodeApi();

			window.addEventListener('message', event => {
				console.log('ChibiCode: Webview received message:', event.data);
				clearTimeout(hideTimer);
				clearInterval(typingTimer);

				const data = event.data; // json data our extension sends
				const expression = sprites[data.expression] ?? sprites.neutral;
				sprite.src = expression.closed;
				const bubble = document.querySelector('.bubble');
				const message = document.getElementById('message');

				const fullText = data.text;
				message.textContent = '';

				if (!fullText) {
					bubble.classList.add('hidden');
					return;
				}
				bubble.classList.remove('hidden');

				const chars = Array.from(fullText);
				let index = 0;
				let mouthOpen = false;
				typingTimer = setInterval(() => {
					message.textContent += chars[index];
					index++;
					
					if(index % 3 === 0){
						mouthOpen = !mouthOpen;
						sprite.src = mouthOpen ? expression.open : expression.closed;
					}

					if(index >= chars.length){
						clearInterval(typingTimer);
						sprite.src = expression.closed;

						hideTimer = setTimeout(() => {
							bubble.classList.add('hidden');
						},3000);
					}
				},40);
			});
			vscode.postMessage({ type: 'ready' });
		</script>

		</body>
		</html>`;			
	}

}

// This method is called when your extension is deactivated
export function deactivate() {}
