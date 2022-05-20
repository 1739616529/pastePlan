import { join } from 'path'
import { Menu, Tray, screen } from 'electron'
import { useSettingWin } from './setting'
import { app } from 'electron'
import { useIcon } from './icon'
let tray: Tray | null = null
import { useLowDB } from 'main/config/index'
const db = useLowDB()['option']

function create_menu_template(): Menu {
	return Menu.buildFromTemplate([
		{
			label: '测试',
			click: useSettingWin,
			accelerator: 'command+,',
		},
		{
			label: '重启',
			click: () => {
				app.relaunch()
			},
			accelerator: 'command+R',
		},
		{
			label: '开机启动',
			click: (e) => {
				db.setData({ selfStart: e.checked }).write()
			},
			type: 'checkbox',
			checked: db.data?.selfStart,
			accelerator: 'command+L',
		},
		{
			label: '粘贴板',
			click: () => {
				app.relaunch()
			},
			accelerator: db.data?.showHomeShortcut.join('+'),
		},

		{
			label: '退出',
			click: app.quit,
			accelerator: 'command+q',
		},
	])
}

function useTrayMenu() {
	if (tray) return
	let toolSip = `pastePlan
		小彩蛋 哈哈
	`
	tray = new Tray(useIcon().useTrayico())
	tray.setToolTip(toolSip)
	tray.setContextMenu(create_menu_template())
	tray.setIgnoreDoubleClickEvents(true)
}

function uploadTrayMenu() {
	if (!tray) return
	tray.setContextMenu(create_menu_template())
}
export { useTrayMenu, uploadTrayMenu }
