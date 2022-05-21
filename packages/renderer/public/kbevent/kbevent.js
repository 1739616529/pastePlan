const kbhook = require('./kbhook')
const events = require('events')

let kbevent = new events.EventEmitter()

kbevent.on('keyevent', (cllaback) => {
	cllaback()
})

function checkKeys(keys) {
	if (keys && Array.isArray(keys)) {
		if (keys.length <= 0) {
			throw 'keys are not set'
		}
	} else {
		throw 'the keys must be an array'
	}

	keys.every(function (value, index) {
		if (typeof value !== 'string') {
			throw keys[index] + ' is not a string'
		}
		if (value === '') {
			throw 'there is a empty key in keys array'
		}
	})

	// Convert all values to uppercase and filter the same value
	return Array.from(
		new Set(
			keys.map(function (value) {
				return value.toUpperCase()
			})
		)
	)
}

function checkType(eventType) {
	if (eventType && typeof eventType === 'string') {
		if (eventType !== 'keydown' && eventType !== 'keyup') {
			throw 'the type must be "keydown" or "keyup"'
		}
		return eventType
	} else {
		return 'keydown'
	}
}

function checkCatchAgain(catchAgain) {
	if (catchAgain && typeof catchAgain === 'boolean') {
		return catchAgain
	} else {
		return false
	}
}

function catchKeys(option, callback) {
	if (typeof option !== 'object') {
		throw 'the first argument must be a object'
	}

	let eventType = checkType(option.eventType),
		keys = checkKeys(option.keys),
		catchAgain = checkCatchAgain(option.catchAgain)

	if (typeof callback !== 'function') {
		throw 'the second argument must be a function'
	}

	;(function catchKeysLoop() {
		if (kbhook.catchKeys(eventType, keys)) {
			kbevent.emit('keyevent', callback)
			if (catchAgain) {
				// Use trampoline function to prevent StackOverflow in recursion
				return catchKeysLoop.call(null)
			} else {
				return null
			}
		}
	})()
}

module.exports = {
	catchKeys: catchKeys,
}
