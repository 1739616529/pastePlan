export type ShortcutKey = string[]

export interface OptionDefaultData {
	showHomeShortcut: ['Control', 'E']
	selfStart: false
	homeWinFixed: false
}

interface OptionData {
	showHomeShortcut: ShortcutKey
	selfStart: boolean
	homeWinFixed: boolean
}

export type SetOption = <
	K extends keyof OptionData,
	V extends OptionData[K]
	>(data: { [key in K]: V }) => void
