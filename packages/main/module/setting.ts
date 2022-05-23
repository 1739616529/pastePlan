import { useLoadWinPath, useWin, clearWin } from '../lib/window'
import { ipcMain, app } from 'electron'
import { uploadTrayMenu } from '../module/tray'
import { useLowDB } from '../config'
import { useSelfStart } from './selfStart'
import { OptionData } from 'project/types/setting'
import { updateHomeShortcut } from './shortcut'
const db = useLowDB()['option']
const page_name = 'setting'

db.on('dataChange', (data) => {
	if ('showHomeShortcut' in data) {
		uploadTrayMenu()
		updateHomeShortcut()
	}
	if ('selfStart' in data) {
		useSelfStart(data)
		uploadTrayMenu()
	}
})

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

	ipcMain.on('setSetting', (e, data: KeyValue<OptionData>) => {
		db.setData(data).write()
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
