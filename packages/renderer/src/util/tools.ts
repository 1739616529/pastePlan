export const format_className = (...args: any[]): string => {
	return args.filter(Boolean).join(' ')
}
