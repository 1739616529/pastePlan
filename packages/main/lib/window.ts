import { BrowserWindow, BrowserWindowConstructorOptions, app } from 'electron'
import { resolve, join } from 'path'
import { PageList } from 'types/window'

export interface winOption extends BrowserWindowConstructorOptions {}
const option: winOption = {
	resizable: false,
	acceptFirstMouse: true,
	webPreferences: {
		preload: join(__dirname, '../preload/index.cjs'),
	},
}

let wins: PageList = {}

/** 第一个传入要创建的 窗口名称 第二个是自定义参数 返回传入名称的窗口实例 如果存在不会创建新的 */
function useWin(win_name: keyof PageList) {
	let win = wins[win_name]
	return function (custom_option: winOption = {}): BrowserWindow {
		if (win) {
			console.error(`Window ${win_name} already exists`)
			return win
		}
		win = new BrowserWindow({ ...option, ...custom_option })
		return win
	}
}

/** 返回已存在窗口的对象 */
function getWins() {
	return wins
}

function clearWins() {
	wins = {}
}

function useLoadWinPath(path: string) {
	return app.isPackaged
		? `file://${resolve(
				__dirname,
				`./renderer/index.html/#/${path}`
		  )}`
		: `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/${path}`
}

export { useWin, getWins, clearWins, useLoadWinPath }
