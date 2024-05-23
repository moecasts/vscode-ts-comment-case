// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentCase, transform } from 'ts-comment-case';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const commentCaseJSDoc = vscode.commands.registerCommand('vscode-ts-comment-case.commentCaseJSDoc', () => {
		const global = vscode.window;
		const editor = global.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;

		const range = editor.selection.isEmpty
			? new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end)
			: editor.selection;

		const text = document.getText(range);
		const newText = transform(text, { commentCase: CommentCase.JSDoc });

		editor.edit((edit) => {
			edit.replace(range, newText);
		});

		global.showInformationMessage('Comment Case changed to JSDoc');
	});

	context.subscriptions.push(commentCaseJSDoc);

	const commentCaseSingle = vscode.commands.registerCommand('vscode-ts-comment-case.commentCaseSingle', () => {
		const global = vscode.window;
		const editor = global.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;

		const range = editor.selection.isEmpty
			? new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end)
			: editor.selection;

		const text = document.getText(range);
		const newText = transform(text, { commentCase: CommentCase.Single });

		editor.edit((edit) => {
			edit.replace(range, newText);
		});

		global.showInformationMessage('Comment Case changed to Single');
	});

	context.subscriptions.push(commentCaseSingle);
}

// This method is called when your extension is deactivated
export function deactivate() {}
