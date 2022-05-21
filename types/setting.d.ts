export type ShortcutKey = string[]

export interface OptionDefaultData {
	showHomeShortcut: ['Command', 'Alt', 'U']
	selfStart: false
}

interface OptionData {
	showHomeShortcut: ShortcutKey
	selfStart: boolean
}

export type option_item = <
	K extends keyof OptionData,
	V extends OptionData[K]
>(data: { [key in K]: V }) => void
