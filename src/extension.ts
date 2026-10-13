// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { randomBytes } from 'crypto';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('We up');

	const provider = new ChibiCodeProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('chibicode-view', provider)
	);

	const disposable = vscode.commands.registerCommand('chibicode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		provider.say('neutral', 'Hello! Ready to code?');
	});

	context.subscriptions.push(disposable);
}

class ChibiCodeProvider implements vscode.WebviewViewProvider{
	constructor(private readonly extensionUri: vscode.Uri) {}

	private view?: vscode.WebviewView;

	resolveWebviewView(webviewView: vscode.WebviewView):void{
		this.view = webviewView;
		const webview = webviewView.webview;

		webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.extensionUri, 'media')
			]
		};
		webview.html = this.getHtml(webview);
	}

	say(expression: string, text:string): void{
		if(this.view){
			this.view.webview.postMessage({
				expression: expression,
				text: text
			});
		}
	}

	private getHtml(webview: vscode.Webview): string {
		const spriteUri = webview.asWebviewUri (vscode.Uri.joinPath(this.extensionUri, 'media', 'neutral_closed.png'));
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

			<img src = "${spriteUri}" alt = "ChibiCode">

			<script nonce="${nonce}">	
			let hideTimer;

			window.addEventListener('message', event => {
				clearTimeout(hideTimer);

				const data = event.data; // json data our extension sends
				const bubble = document.querySelector('.bubble');
				const message = document.getElementById('message');

				message.textContent = data.text;
				bubble.classList.remove('hidden');

				hideTimer = setTimeout(() => {
					bubble.classList.add('hidden');
				}, 3000);
			});
		</script>

		</body>
		</html>`;			
	}

}

// This method is called when your extension is deactivated
export function deactivate() {}
