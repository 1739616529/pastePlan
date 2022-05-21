import { app } from 'electron'
import { OptionData } from 'project/types/setting'
function useSelfStart(data: Partial<OptionData>) {
	app.setLoginItemSettings({
		openAtLogin: data.selfStart,
	})

	console.log(app.getLoginItemSettings())
}

export { useSelfStart }
