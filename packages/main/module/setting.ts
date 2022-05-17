import { useLoadWinPath, useWin } from '../lib/window'
const page_name = 'setting'
function useSettingWin() {
	const win = useWin(page_name)({
		width: 500,
		height: 500,
		title: '设置',
	})
	win.loadURL(useLoadWinPath(page_name))
}

export { useSettingWin }
