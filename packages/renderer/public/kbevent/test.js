const kbevent = require('./kbevent')
kbevent.catchKeys(
	{
		eventType: 'keydown', //Optional, default: 'keydown'
		keys: ['CONTROL', 'C'], // required
		catchAgain: true, // Optional, default: false
	},
	callback
)
