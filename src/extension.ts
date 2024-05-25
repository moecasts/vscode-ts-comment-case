// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentCase, moveTrailingCommentToLeading, transform } from 'ts-comment-case';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const transformFn = (
		action: (text: string) => string = text => text,
		callback?: () => void,
	) => {
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

		const result = action(text);

		editor.edit((edit) => {
			edit.replace(range, result);
		});

		callback?.();
	};

	const tsccTransformJSDoc = vscode.commands.registerCommand('vscode-ts-comment-case.tsccTransformJSDoc', () => {
		transformFn(
			(text) => transform(text, { commentCase: CommentCase.JSDoc }),
			() => {
				vscode.window.showInformationMessage('Comment Case changed to JSDoc');
			}
		);
	});

	const tsccTransformSingle = vscode.commands.registerCommand('vscode-ts-comment-case.tsccTransformSingle', () => {
		transformFn(
			(text) => transform(text, { commentCase: CommentCase.Single }),
			() => {
				vscode.window.showInformationMessage('Comment Case changed to Single');
			}
		);
	});

	const tsccMove = vscode.commands.registerCommand('vscode-ts-comment-case.tsccMove', () => {
		transformFn(
			(text) => moveTrailingCommentToLeading(text),
			() => {
				vscode.window.showInformationMessage('moved trailing comment to leading');
			}
		);
	});

	const tsccMoveAndTransformJSDoc = vscode.commands.registerCommand('vscode-ts-comment-case.tsccMoveAndTransformJSDoc', () => {
		transformFn(
			(text) => transform(moveTrailingCommentToLeading(text), { commentCase: CommentCase.JSDoc }),
			() => {
				vscode.window.showInformationMessage('moved trailing comment to leading and Comment case as JSDoc');
			}
		);
	});

	const tsccMoveAndTransformSingle = vscode.commands.registerCommand('vscode-ts-comment-case.tsccMoveAndTransformSingle', () => {
		transformFn(
			(text) => transform(moveTrailingCommentToLeading(text), { commentCase: CommentCase.Single }),
			() => {
				vscode.window.showInformationMessage('moved trailing comment to leading and Comment case as Single');
			}
		);
	});

	context.subscriptions.push(tsccTransformJSDoc);
	context.subscriptions.push(tsccTransformSingle);
	context.subscriptions.push(tsccMove);
	context.subscriptions.push(tsccMoveAndTransformJSDoc);
	context.subscriptions.push(tsccMoveAndTransformSingle);
}

// This method is called when your extension is deactivated
export function deactivate() { }
