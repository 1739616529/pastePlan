import { app, shell, ipcMain, screen, globalShortcut } from 'electron'
import { useLoadWinPath, useWin } from '../lib/window'
import { join } from 'path'

function useMainWin() {
	let win = useWin('home')({
		title: 'Main window',
		frame: false,
		width: 300,
		height: 500,
		movable: false,
		skipTaskbar: false,
	})
	win.webContents.openDevTools()
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
}
export { useMainWin }
