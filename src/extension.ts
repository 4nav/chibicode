import * as vscode from 'vscode';
import {randomBytes} from 'crypto';
import {pick} from './dialogue';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('ChibiCode: Activated');

	const provider = new ChibiCodeProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('chibicode-view', provider)
	);

	const disposable = vscode.commands.registerCommand('chibicode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		provider.say('crying', 'Oh no, something went wrong!');
	});

	context.subscriptions.push(disposable);
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

			let prevHead = repo.state.HEAD;

			const disposable = repo.state.onDidChange(() => {
				const curHead = repo.state.HEAD;

				if(curHead?.commit && prevHead?.commit && curHead.commit !== prevHead.commit && curHead.name === prevHead.name){
					console.log('ChibiCode: Commit detected!');
            		provider.react('commit', true);
				}
				prevHead = curHead;
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
	constructor(private readonly extensionUri: vscode.Uri) {}

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
		const now = Date.now();
		

		if(!bypassCooldown && now - this.lastReaction < this.cooldown){
			return;
		}

		const line = pick(event);
		console.log('ChibiCode: Reacting to event:', event, line);
		this.lastReaction = now;
		this.say(line.expression, line.text);
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
