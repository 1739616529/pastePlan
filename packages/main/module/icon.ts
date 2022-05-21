import { join } from 'path'
import { nativeImage, NativeImage } from 'electron'
let path = join(__dirname, '../renderer/images/trayTemplate.png')
let img = nativeImage.createFromPath(path)
if (img.isTemplateImage()) img.setTemplateImage(true)

function useTrayico() {
	const tray_ico = img.resize({ width: 17, height: 17 })
	tray_ico.setTemplateImage(true)
	return tray_ico
}
function useIcon() {
	return { img, path, useTrayico }
}

export { useIcon }
