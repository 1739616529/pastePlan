import { join } from 'path'
import { nativeImage, NativeImage } from 'electron'

let internal = {
	img: nativeImage.createFromPath(
		join(__dirname, '../renderer/images/tray.png')
	),
	useTrayico,
}
function useTrayico() {
	return internal.img.resize({ width: 17, height: 17 })
}
function useIcon() {
	return internal
}

export { useIcon }
