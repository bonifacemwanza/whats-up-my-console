"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const outputChannel = vscode_1.window.createOutputChannel('Extension Logs');
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.debugger.attach({ tabId }, '1.3', () => {
            chrome.debugger.sendCommand({ tabId }, 'Console.enable', {}, () => {
                chrome.debugger.onEvent.addListener((source, method, params) => {
                    if (source.tabId === tabId && method === 'Console.messageAdded') {
                        const message = params.message;
                        outputChannel.appendLine(`New console log: ${message.text}`);
                        outputChannel.show(); // Show the OutputChannel in VS Code
                    }
                });
                chrome.debugger.sendCommand({ tabId }, 'Console.enable', {}, () => {
                    chrome.debugger.sendCommand({ tabId }, 'Console.clearMessages');
                });
            });
        });
    }
});
//# sourceMappingURL=background.js.map