// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
		vscode.window.showInformationMessage('Hello World from chibicode!');
	});

	context.subscriptions.push(disposable);
}

class ChibiCodeProvider implements vscode.WebviewViewProvider{
	constructor(private readonly extensionUri: vscode.Uri) {}

	resolveWebviewView(webviewView: vscode.WebviewView):void{
		const webview = webviewView.webview;

		webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.extensionUri, 'media')
			]
		};
		webview.html = this.getHtml(webview);
	}

	private getHtml(webview: vscode.Webview): string {
		const spriteUri = webview.asWebviewUri (vscode.Uri.joinPath(this.extensionUri, 'media', 'neutral_closed.png'));

		return `<!DOCTYPE html>
		<html lang = "en">
		<head>
			<meta charset = "UTF-8">
			<meta name = "viewport" content = "width=device-width, initial-scale = 1.0">
			<meta http-equiv="Content-Security-Policy"
        		content="default-src 'none'; img-src ${webview.cspSource} https:; style-src 'unsafe-inline';">
				
				<title>ChibiCode</title>

				<style>
					body{
						margin: 0;
						padding: 20px;
						display: flex;
						flex-direction: column;
						align-items: center;
						background: #fff0f6;
						color: #4a3040;
						font-family: sans-serif;
					}

					img{
						width: 100%;
						max-width: 100%;
						height: auto;
						object-fit: contain;
					}

					.bubble{
					}
					</style>
		</head>
		<body>
			<h1>Knockoff Alya</h1>
			<img src = "${spriteUri}" alt = "ChibiCode">
			<div class="bubble">Ready to code?</div>
		</body>
		</html>`;			
	}

}

// This method is called when your extension is deactivated
export function deactivate() {}
