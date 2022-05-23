import { join } from 'path'
import { PlanItem } from 'project/types/planList.d'
import { clipboard, NativeImage } from 'electron'
import { exec, ChildProcess } from 'child_process'
import { EventEmitter } from 'events'
let plan_list: PlanItem[] = []
let plan_item: PlanItem = {
	type: 'text',
	time: 0,
	data: '',
}
let saveToclipDate = 0
let naiveImageEnum: { [key: string | number]: NativeImage } = {}

function saveToClipboardData(type: 'text' | 'image') {
	const new_date = new Date().getTime()
	if (new_date - saveToclipDate <= 300) return
	plan_item.type = type
	plan_item.time = new_date

	if (type === 'text') {
		const text_ret = clipboard.readText()
		plan_item.data = text_ret
	}

	if (type === 'image') {
		const img_ret = clipboard.readImage()
		let img_Base64 = img_ret.toDataURL()
		const { width, height } = img_ret.getSize()
		const ratio = width / height
		if (ratio > 2.875) {
			img_Base64 = img_ret
				.resize({ width: 100 })
				// .resize({ width: 268 })
				.toDataURL()
		} else {
			img_Base64 = img_ret
				.resize({ height: 60 })
				// .resize({ height: 90 })
				.toDataURL()
		}

		plan_item.data = img_Base64
		naiveImageEnum[plan_item.time] = img_ret
	}

	if (plan_list.length >= 20) {
		const item = plan_list.pop()
		if (item && item.type === 'image') {
			delete naiveImageEnum[item.time]
		}
	}
	console.log(plan_item)
	plan_list.unshift({ ...plan_item })
}

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

let listen_clipboard: ListerClipboard | null
export function useClipboard() {
	listen_clipboard = new ListerClipboard()
	listen_clipboard?.listering()
	listen_clipboard?.on('change', ({ type }) => {
		saveToClipboardData(type)
	})
}

export function unCliboard() {
	listen_clipboard?.kill()
}

export function getClipBoardData() {
	return plan_list
}

export function saveToClipboard(time: number) {
	plan_list.some((v) => {
		if (v.time !== time) return

		if (v.type === 'image') {
			clipboard.writeImage(naiveImageEnum[time])
		}

		if (v.type === 'text') clipboard.writeText(v.data)

		saveToclipDate = new Date().getTime()
		return true
	})
}
