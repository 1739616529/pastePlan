import { useLoadWinPath, useWin, clearWin } from '../lib/window'
import { ipcMain, app } from 'electron'
import { uploadTrayMenu } from '../module/tray'
import { useLowDB } from '../config'
import { is_have_key } from 'project/packages/util/tools'
const db = useLowDB()['option']
const page_name = 'setting'

function useSettingWin() {
	const { win, isExist } = useWin(page_name)({
		width: 500,
		height: 500,
		title: '设置',
		titleBarStyle: 'hidden',
		transparent: true,
		visualEffectState: 'active',
		vibrancy: 'hud', // fullscreen-ui header hud popover sidebar under-window
	})

	// 如果存在
	if (isExist) return win.show()

	win.loadURL(useLoadWinPath(page_name))
	win.webContents.openDevTools()

	ipcMain.on('setSetting', (e, data) => {
		db.setData(data).write()
		if (is_have_key(data, 'selfStart')) {
			app.setLoginItemSettings({
				openAtLogin: data['selfStart'],
				openAsHidden: true,
			})

			console.log(app.getLoginItemSettings())
		}

		if (is_have_key(data, 'showHomeShortcut')) uploadTrayMenu()
	})

	ipcMain.handle('getSetting', (e, data) => {
		return db.data
	})

	ipcMain.handle('getName', (e, data) => {
		return process.execPath
	})

	win.on('closed', () => {
		clearWin(page_name)
		ipcMain.removeHandler('getSetting')
		ipcMain.removeHandler('getName')
		ipcMain.removeAllListeners('setSetting')
	})
}

export { useSettingWin }
