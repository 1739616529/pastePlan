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

export type BroadcastFun<T> = (data: Partial<T>) => void
export type ListenList<T> = {
	dataChange: BroadcastFun<T>[]
}

export class JSONDB<T> {
	private _data!: T
	private db_path: string = ''
	private file_exist: boolean = false
	public default_data: T | null = null
	private listen_list: ListenList<T> = {
		dataChange: [],
	}
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

	public setData(data: Partial<T>): this {
		if (this._data) this._data = { ...this._data, ...data }
		this.listen_list['dataChange'].forEach((v) => v(data))
		return this
	}

	public on(cannle: keyof ListenList<T>, fn: BroadcastFun<T>) {
		this.listen_list[cannle].push(fn)
	}

	/** 数据修改完必须 执行 write 才会保存本地 */
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
