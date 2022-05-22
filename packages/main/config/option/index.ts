import { JSONDB } from '../JSONDB'
import { OptionDefaultData, OptionData } from 'project/types/setting'
const file_path = JSONDB.getJSONDBPath('option.json')
const db = new JSONDB<OptionData>(file_path)
// win		Ctrl		Win			Alt
// mac		control   		command       Alt
let default_data: OptionDefaultData = {
	showHomeShortcut: ['Command', 'Alt', 'U'],
	selfStart: false,
	homeWinFixed: false,
}

db.default(default_data)
export default db
