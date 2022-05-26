import { join } from 'path'
import { PlanItem } from 'project/types/planList.d'
import { clipboard, NativeImage } from 'electron'
import { exec, ChildProcess } from 'child_process'
import { EventEmitter } from 'events'
import { getWins } from 'main/lib/window'
let home_win = getWins()['home']
class ListerClipboard extends EventEmitter {
	private _child: ChildProcess | null = null
	listering() {
		this._child = exec(
			join(__dirname, '../renderer/go-module/main'),
			(...args) => {
				console.log(args)
			}
		)

		this._child.stdout?.on('data', (data) => {
			this.emit('change', { type: data.replace('\n', '') })
		})
	}

	kill() {
		if (this._child) this._child.kill()
		this._child = null
	}
}

class ClipboardModule extends ListerClipboard {
	private _plan_list: PlanItem[] = []
	private _naiveImageEnum: { [key: string | number]: NativeImage } = {}
	private _saceToClipItem!: { time: number; key: number } | null
	private _plan_item: PlanItem = {
		type: 'text',
		time: 0,
		data: '',
	}

	public get plan_list() {
		return this._plan_list
	}

	public useListen() {
		this.listering()
		this.on('change', ({ type }) => {
			this.saveToClipboardData(type)
			if (!home_win) home_win = getWins()['home']
			home_win?.webContents.send('home', {
				type: 'clipboardData',
				data: this._plan_list,
			})
		})
	}

	public unListen() {
		this.kill()
		this._saceToClipItem = null
	}

	private saveToClipboardData(type: 'text' | 'image') {
		console.log(1)
		if (
			this._saceToClipItem &&
			this._saceToClipItem.time ===
			this._plan_list[this._saceToClipItem.key].time
		) {
			this._saceToClipItem = null
			return
		}
		console.log(2)
		const new_date = new Date().getTime()
		this._plan_item.type = type
		this._plan_item.time = new_date

		if (type === 'text') {
			const text_ret = clipboard.readText()
			this._plan_item.data = text_ret
		}

		if (type === 'image') {
			const img_ret = clipboard.readImage()
			let img_Base64 = img_ret.toDataURL()
			const { width, height } = img_ret.getSize()
			const ratio = width / height
			img_Base64 = img_ret.resize(ratio > 2.875 ? { width: 100 } : { height: 60 })
				.toDataURL()

			// if (ratio > 2.875) {
			// 	img_Base64 = img_ret
			// 		.resize({ width: 100 })
			// 		// .resize({ width: 268 })
			// 		.toDataURL()
			// } else {
			// 	img_Base64 = img_ret
			// 		.resize({ height: 60 })
			// 		// .resize({ height: 90 })
			// 		.toDataURL()
			// }

			this._plan_item.data = img_Base64
			this._naiveImageEnum[this._plan_item.time] = img_ret
		}

		if (this._plan_list.length >= 20) {
			const item = this._plan_list.pop()
			if (item && item.type === 'image') {
				delete this._naiveImageEnum[item.time]
			}
		}
		console.log(this._plan_item)
		this._plan_list.unshift({ ...this._plan_item })
	}

	public saveToClipboard(time: number) {
		this.plan_list.some((v, i) => {
			if (v.time !== time) return

			if (v.type === 'image') {
				clipboard.writeImage(this._naiveImageEnum[time])
			}

			if (v.type === 'text') clipboard.writeText(v.data)

			this._saceToClipItem = { time: v.time, key: i }
			console.log('sace to clip')
			return true
		})
	}
}

export default new ClipboardModule()
