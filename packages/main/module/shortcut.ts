import { globalShortcut } from 'electron'
import { useLowDB } from '../config/index'
const option = useLowDB()['option']
function useGlobalShortcut() {
	// globalShortcut.
}
function useShortcut() {}

export { useShortcut }
