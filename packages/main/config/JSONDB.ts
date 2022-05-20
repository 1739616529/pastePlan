import { join, dirname } from 'path'
import { app } from 'electron'
import {
	readFileSync,
	writeFile,
	accessSync,
	constants,
	existsSync,
	mkdirSync,
} from 'fs-extra'

export class JSONDB<T> {
	private _data: T | null = null
	private db_path: string = ''
	private file_exist: boolean = false
	public default_data: T | null = null

	/** 传入 json文件的绝对路径 */
	constructor(name: string) {
		this.db_path = name
		this.file_exist = JSONDB.isExistFile(this.db_path)
		if (!this.file_exist) return
		this.read()
	}

	public get data() {
		return this._data
	}

	public setData<V extends keyof T, Z extends T[V]>(data: {
		[key in V]: Z
	}) {
		if (this._data) this._data = { ...this._data, ...data }
		return this
	}

	public write() {
		const db_dir = dirname(this.db_path)
		if (!existsSync(db_dir)) mkdirSync(db_dir)
		writeFile(this.db_path, JSON.stringify(this._data), {
			encoding: 'utf8',
		})
	}

	public read() {
		if (this._data) return
		const data_buffer = readFileSync(this.db_path, 'utf8')
		this._data = JSON.parse(data_buffer)
	}

	public default(data: T) {
		this.default_data = data
		if (this.file_exist) return
		this._data = data
		this.write()
	}

	static getJSONDBPath(...args: string[]) {
		return join(app.getPath('userData'), 'JSON_db', ...args)
	}

	static isExistFile(path: string): boolean {
		try {
			accessSync(
				path,
				constants.F_OK | constants.R_OK | constants.W_OK
			)
			return true
		} catch (err) {
			return false
		}
	}
}
