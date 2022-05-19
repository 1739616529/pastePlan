import { JSONDB } from '../JSONDB'

const file_path = JSONDB.getJSONDBPath('option.json')
const db = new JSONDB<OptionDefaultData>(file_path)
// win		Ctrl		Win			Alt
// mac		control   		command       Alt
let default_data: OptionDefaultData = {
	showHomeShortcut: 'alt+command+u',
	selfStart: false,
}

db.default(default_data)
export default db
