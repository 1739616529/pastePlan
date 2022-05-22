import { BrowserWindow, BrowserWindowConstructorOptions, app } from 'electron'
import { resolve, join } from 'path'
import { PageList } from 'types/window'

export interface winOption extends BrowserWindowConstructorOptions {}
const option: winOption = {
	resizable: false,
	acceptFirstMouse: true,
	fullscreen: false,
	fullscreenable: false,
	skipTaskbar: true,
	webPreferences: {
		preload: join(__dirname, '../preload/index.cjs'),
	},
}

let wins: PageList = {}

/** 第一个传入要创建的 窗口名称 第二个是自定义参数 返回传入名称的窗口实例 如果存在不会创建新的 */
function useWin(win_name: keyof PageList) {
	return function (custom_option: winOption = {}): {
		win: BrowserWindow
		isExist: boolean
	} {
		let isExist = false
		let win = wins[win_name]
		if (win !== undefined) {
			console.error(`Window ${win_name} already exists`)
			isExist = true
		} else {
			win = new BrowserWindow({
				...option,
				...custom_option,
				webPreferences: {
					...option.webPreferences,
					...custom_option.webPreferences,
				},
			})
			wins[win_name] = win
		}
		return { win, isExist }
	}
}

/** 返回已存在窗口的对象 */
function getWins() {
	return wins
}

function clearWins() {
	wins = {}
}

function clearWin(win_name: keyof PageList) {
	delete wins[win_name]
}

function useLoadWinPath(path: string) {
	return app.isPackaged
		? `file://${resolve(
				__dirname,
				`../renderer/index.html#/${path}`
		  )}`
		: `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}#/${path}`
}

export { useWin, getWins, clearWins, useLoadWinPath, clearWin }
