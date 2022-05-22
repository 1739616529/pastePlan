import { PlanItem } from 'project/types/planList.d'
import { clipboard, NativeImage } from 'electron'
let timer: NodeJS.Timer
let plan_list: PlanItem[] = []
const text = ''
const img = 'data:image/png;base64,'
let is_change = false
let plan_item: PlanItem = {
	type: 'text',
	time: 0,
	data: '',
}

let save_clipboard_item: PlanItem | undefined

let naiveImageEnum: { [key: string | number]: NativeImage } = {}
export function useClipboard() {
	timer = setInterval(() => {
		const text_ret = clipboard.readText()
		if (text !== text_ret) {
			if (text_ret === plan_item.data) return
			plan_item.time = new Date().getTime()
			is_change = true
			plan_item.type = 'text'
			plan_item.data = text_ret
		} else {
			const img_ret = clipboard.readImage()
			let img_Base64 = img_ret.toDataURL()
			if (img_Base64 === img) return
			plan_item.time = new Date().getTime()
			is_change = true
			plan_item.type = 'img'
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

			if (img_Base64 === plan_item.data) return
			plan_item.data = img_Base64
			naiveImageEnum[plan_item.time] = img_ret
		}

		if (
			save_clipboard_item &&
			save_clipboard_item.data === plan_item.data
		)
			return

		if (is_change) {
			if (plan_list.length >= 20) {
				const item = plan_list.pop()
				if (item && item.type === 'img') {
					delete naiveImageEnum[item.time]
				}
			}

			plan_list.unshift({ ...plan_item })
		}
	}, 600)
}

export function unCliboard() {
	if (timer) clearInterval(timer)
	is_change = false
	save_clipboard_item = undefined
}

export function getClipBoardData() {
	return plan_list
}

export function saveToClipboard(time: number) {
	plan_list.some((v) => {
		if (v.time !== time) return

		if (v.type === 'img') {
			clipboard.writeImage(naiveImageEnum[time])
		}

		if (v.type === 'text') clipboard.writeText(v.data)

		save_clipboard_item = v
		return true
	})
}
