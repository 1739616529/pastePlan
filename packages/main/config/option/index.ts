import { JSONDB } from '../JSONDB'
import { ipcMain } from 'electron'
import { OptionDefaultData, OptionData } from 'project/types/setting'
const file_path = JSONDB.getJSONDBPath('option.json')

const db = new JSONDB<OptionData>(file_path)
// win		Ctrl		Win			Alt
// mac		control   		command       Alt
let default_data: OptionDefaultData = {
	showHomeShortcut: ['Control', 'E'],
	selfStart: false,
	homeWinFixed: false,
}

db.default(default_data)

ipcMain.handle('getSetting', (e, data) => {
	return db.data
})
ipcMain.on('setSetting', (e, data: KeyValue<OptionData>) => {
	db.setData(data).write()
})
export default db
