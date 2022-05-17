import { JSONFile, Low } from 'lowdb'
import { resolve } from 'path'
const json_file_path = resolve('db.json')
console.error(json_file_path)
const adapter = new JSONFile('db.json')
const db = new Low(adapter)
