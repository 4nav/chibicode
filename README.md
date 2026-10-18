# ChibiCode

A cute anime companion for VS Code that reacts to your coding activity.



**[Download the latest release](../../releases/latest)**

## Features

- **Animated companion:** Chibi coding companion with blinking animations and multiple expressions.
- **Dynamic dialogue:** Messages that change based on your coding activity.
- **Activity tracking:** Uses Hackatime stats to track coding time and inactivity.
- **Git reactions:** Reacts when you make commits.

## Installation

1. Download the `.vsix` file from [Releases](../../releases).
2. Open VS Code and go to the Extensions panel.
3. Open the `...` menu and select **Install from VSIX...**.
4. Select the downloaded file.

## Development

Requires Node.js and npm.

```bash
git clone https://github.com/4nav/chibicode.git
cd chibicode
npm install
npm run compile
```

To package the extension locally:

```bash
npx vsce package
```

## Built with
TypeScript and the VS Code Extension API.

