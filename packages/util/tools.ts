/** 节流 */
export function throttle(fn: Function, delay: number = 500) {
	let is_ok = true

	return function (this: unknown, ...args: any[]) {
		if (!is_ok) return
		is_ok = false
		fn.apply(this, args)

		setTimeout(() => {
			is_ok = true
		}, delay)
	}
}

/** 防抖 */
export function debounce(fn: Function, delay: number = 500) {
	let timer: number

	return function (this: unknown, ...args: any[]) {
		if (timer) clearTimeout(timer)
		setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}

export function is_have_key(...args: unknown[]) {
	return args.some((v) => {
		return v !== undefined
	})
}
