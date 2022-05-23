import { useLowDB } from 'main/config/index'
import { app, shell, ipcMain, screen, globalShortcut, dialog } from 'electron'
import { useLoadWinPath, useWin } from '../lib/window'
import { join } from 'path'
import { useHomeShortcut } from './shortcut'
import clipboardModule from './clipboard'
const db = useLowDB()['option']
function useMainWin() {
	const { win, isExist } = useWin('home')({
		title: 'Main window',
		frame: false,
		width: 300,
		height: 500,
		// movable: false,
		skipTaskbar: false,
		// focusable: false,
		alwaysOnTop: true,
		show: false,
		webPreferences: {
			webSecurity: false,
		},
	})

	// 如果存在
	if (isExist) return win.show()

	const url = useLoadWinPath('home')
	win.loadURL(url)

	// Test active push message to Renderer-process
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send(
			'main-process-message',
			new Date().toLocaleString()
		)
	})

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url)
		return { action: 'deny' }
	})

	useHomeShortcut()

	win.on('blur', () => {
		console.log('blur')
		console.log(db.data.homeWinFixed)
		if (!db.data.homeWinFixed) win.hide()
	})

	ipcMain.on('save-clipboard-data', (e, data: number) => {
		clipboardModule.saveToClipboard(data)
		if (!db.data.homeWinFixed) win.hide()
	})
}
export { useMainWin }
