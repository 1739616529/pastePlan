import { powerMonitor, app } from 'electron'
powerMonitor.on('shutdown', () => {
	app.quit()
	app.exit(0)
})
