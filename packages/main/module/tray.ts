import { join } from 'path'
import { Menu, Tray, screen } from 'electron'
import { useSettingWin } from './setting'
let tray: Tray | null = null

function useTrayMenu() {
	tray = new Tray(join(__dirname, '../renderer/images/node.png'))
	const contextMenu = Menu.buildFromTemplate([
		{
			label: '测试',
			click: useSettingWin,
			accelerator: 'Alt+Cmd+I',
		},
	])
	tray.setToolTip('test tray menu')
	tray.setContextMenu(contextMenu)
}
export { useTrayMenu }
