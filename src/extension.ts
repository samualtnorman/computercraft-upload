/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { request } from "./lib";
import * as querystring from "querystring";
import { basename } from "path";
import { minify } from "luamin";

export function activate(context: vscode.ExtensionContext) {
	const api_dev_key = "a63017a41c0ea1300ee52704c2689905";

	let api_user_key: string | null = null;

	vscode.commands.registerCommand("computercraft-upload.upload", async () => {
		if (vscode.window.activeTextEditor) {
			const api_paste_code = vscode.window.activeTextEditor.document.getText();
			const name = basename(vscode.window.activeTextEditor.document.fileName).split(".")[0];

			const data: {
				api_dev_key: string,
				api_paste_code: string,
				api_option: "paste",
				api_paste_private: 1,
				api_paste_expire_date: "10M",
				api_user_key?: string
			} = {
				api_dev_key,
				api_paste_code,
				api_option: "paste",
				api_paste_private: 1,
				api_paste_expire_date: "10M"
			};

			if (api_user_key) {
				data.api_user_key = api_user_key;
			}

			const response = (await request({
				method: "POST",
				host: "pastebin.com",
				path: "/api/api_post.php",
				headers: { "Content-Type": "application/x-www-form-urlencoded" }
			}, querystring.stringify(data))).toString();

			if (response[0] === "h") {
				vscode.env.clipboard.writeText(`pastebin get ${response.split("/").slice(-1)[0]} ${name}`);
			} else {
				vscode.window.showErrorMessage(response);
			}
		}
	});

	vscode.commands.registerCommand("computercraft-upload.login", async () => {
		const response = (await request({
			method: "POST",
			host: "pastebin.com",
			path: "/api/api_login.php",
			headers: { "Content-Type": "application/x-www-form-urlencoded" }
		}, querystring.stringify({
			api_dev_key,
			api_user_name: await vscode.window.showInputBox({ prompt: "username" }),
			api_user_password: await vscode.window.showInputBox({ prompt: "password", password: true })
		}))).toString();

		if (response.length === 32) {
			api_user_key = response;
		} else {
			vscode.window.showErrorMessage(response);
		}
	});

	vscode.commands.registerCommand("computercraft-upload.copy", () => {
		if (vscode.window.activeTextEditor) {
			vscode.env.clipboard.writeText(minify(vscode.window.activeTextEditor.document.getText()));
		}
	});
}
