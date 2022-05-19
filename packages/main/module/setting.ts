import { useLoadWinPath, useWin } from '../lib/window'
import { ipcMain } from 'electron'
import { useLowDB } from '../config'
const db = useLowDB()['option']
const page_name = 'setting'
function useSettingWin() {
	const win = useWin(page_name)({
		width: 500,
		height: 500,
		title: '设置',
		titleBarStyle: 'hidden',
		transparent: true,
		visualEffectState: 'active',
		vibrancy: 'hud', // fullscreen-ui header hud popover sidebar under-window
	})
	win.loadURL(useLoadWinPath(page_name))
	win.webContents.openDevTools()

	console.log(db.data)
	ipcMain.on('setSetting', (e, data) => {
		console.log(data)
	})
	ipcMain.handle('getSetting', (e, data) => {
		return db.data
	})
	// win.setWindowButtonVisibility(true)
}

export { useSettingWin }
