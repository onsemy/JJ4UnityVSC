import * as vscode from 'vscode';
import * as net from 'net';

export function activate(context: vscode.ExtensionContext) {
    // NOTE(JJO): 파일 저장 이벤트 구독
    const disposable = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        // NOTE(JJO): 저장된 파일이 C# 파일인지 확인
        if (document.languageId === 'csharp') {
            // NOTE(JJO): 소켓 클라이언트를 사용하여 유니티 에디터에 명령 보내기
            const client = new net.Socket();
            client.connect(28999, '127.0.0.1', () => {
                console.log('Connected to Unity Editor');
                client.write('#refresh');
                client.end();
            });

            client.on('error', (err) => {
                vscode.window.showErrorMessage(`Error connecting to Unity: ${err.message}`);
            });

            vscode.window.showInformationMessage('Sent refresh command to Unity Editor');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
