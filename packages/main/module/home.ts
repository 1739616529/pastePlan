import { useLowDB } from 'main/config/index'
import { app, shell, ipcMain, screen, globalShortcut, dialog } from 'electron'
import { useLoadWinPath, useWin } from '../lib/window'
import { join } from 'path'
import readline from 'readline'
import { useHomeShortcut } from './shortcut'
const db = useLowDB()['option']
function useMainWin() {
	const { win, isExist } = useWin('home')({
		title: 'Main window',
		frame: false,
		width: 300,
		height: 500,
		// movable: false,
		skipTaskbar: false,
		focusable: false,
		alwaysOnTop: true,
		show: false,
	})

	// 如果存在
	if (isExist) return win.show()

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

	globalShortcut.register('Command+C', () => {
		console.log('copy')
	})
	useHomeShortcut()

	// useMouseClick(() => {
	// 	console.log('mouseClick is ok')
	// })
	// useKeyboardClick(
	// 	() => {
	// 		console.log('control')
	// 	},
	// 	{ key: ['Control', 'C'] }
	// )
}
export { useMainWin }
