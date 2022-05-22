import { app, globalShortcut } from 'electron'
import { release } from 'os'
import { useMainWin } from './module/home'
import { clearWins } from './lib/window'
import { useTrayMenu } from './module/tray'
import './samples/npm-esm-packages'
import { unShortcut } from './module/shortcut'
import { unCliboard, useClipboard } from './module/clipboard'
app.dock.hide()
// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())
if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}
app.whenReady().then(() => {
	useMainWin()

	useTrayMenu()
	// useClipboard()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
	clearWins()
	unShortcut()
	unCliboard
})
