'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "dim": {
        "channel": 3,
        "key": "LEVEL",
        "set": {
            "key": "LEVEL",
            "channel": 4
        },
        "windowcoverings_state": {
            "channel": 3,
            "key": "ACTIVITY_STATE",
            "convert": activivateStateToCoveringState,
            "set": {
                "key": "LEVEL",
                "channel": 4,
                "convert": convertSetState,
                "convertKey": convertSetKey
            }
        }
    }
}

activivateStateToCoveringState = function (value) {
    if (value === "UP") {
        return "up"
    } else if (value === "DOWN") {
        return "down"
    }
    return "idle"
}

convertSetKey = function (key, value) {
    if (value === "up") {
        return "LEVEL"
    } else if (value === "down") {
        return "LEVEL"
    }
    return "STOP"
}

convertSetState = function (value) {
    if (value === "up") {
        return "0.0"
    } else if (value === "down") {
        return "1.0"
    }
    return true
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
        this._driver = this.getDriver();
    }

    initializeExtraEventListeners() {
        var self = this;
        for (let button = 1; button <= 2; button++) {
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
                self._driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "short" })
            });
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                self._driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "long" })
            });
        }

    }
}

module.exports = HomematicDevice;