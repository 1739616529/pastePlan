export type ShortcutKey = string[]

export interface OptionDefaultData {
	showHomeShortcut: ['Command', 'Alt', 'U']
	selfStart: false
	homeWinFixed: false
}

interface OptionData {
	showHomeShortcut: ShortcutKey
	selfStart: boolean
	homeWinFixed: boolean
}

export type option_item = <
	K extends keyof OptionData,
	V extends OptionData[K]
>(data: { [key in K]: V }) => void
