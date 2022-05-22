import { globalShortcut, dialog } from 'electron'
import { useLowDB } from '../config/index'
import { getWins } from '../lib/window'
// const { rsHook } = require('@tcardlab/rshook')
const option = useLowDB()['option']

function shortcut_fun() {
	const home_win = getWins()['home']
	home_win?.isVisible() ? home_win?.hide() : home_win?.show()
	console.log('acclerator is ok')
}

function useGlobalShortcut(acclerator: string) {
	globalShortcut.register(acclerator, shortcut_fun)
}

function get_user_custom_acclerator(): string {
	return option.data.showHomeShortcut.join('+')
}

function acclerator_is_register(acclerator: string) {
	return globalShortcut.isRegistered(acclerator)
}

export function useHomeShortcut() {
	const show_home_acclerator = get_user_custom_acclerator()

	if (acclerator_is_register(show_home_acclerator)) return

	useGlobalShortcut(show_home_acclerator)

	if (!acclerator_is_register(show_home_acclerator))
		dialog.showErrorBox(
			'快捷键注册失败',
			`打开粘贴板的 快捷键 ${show_home_acclerator} 注册失败 可重启软件或切换快捷键后重试`
		)
}

export function unShortcut() {
	globalShortcut.unregisterAll()
}

export function updateHomeShortcut() {
	unShortcut()
	useHomeShortcut()
}

// function useRsHook() {
// 	if (rs_instanse) return rs_instanse
// 	function rs_instanse(cb: cbFun) {
// 		rsHook((err: any, ...e: rsEvents) => {
// 			let key = e[3].replace(/(Key|Left|Right)/, '')
// 			if (key === 'Meta') key = 'Command'
// 			cb(e, key)
// 		})
// 	}
// 	return rs_instanse
// }

// export function useMouseClick(fn: cbFun) {
// 	useRsHook()((e, key) => {
// 		if (e[0] === EventType['mousedown']) fn(e, key)
// 	})
// }

// export function useKeyboardClick(fn: Function, option: RsOption) {
// 	let active_key = 0
// 	useRsHook()((e, key) => {
// 		if (option.key?.indexOf(key) > -1) {
// 			if (e[0] === EventType['keydown']) active_key++
// 			if (e[0] === EventType['keyup']) active_key--
// 			console.log(active_key, e)
// 			if (active_key >= option.key.length) fn()
// 		}
// 	})
// }
