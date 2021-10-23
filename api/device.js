
import {getDevicesOrg, newDevice} from '../db.js';

async function getDevices(idOrg) {
    
    return await getDevicesOrg(1);
}

async function saveDevice(idOrg, lat, long, type, display) {
    return await newDevice(idOrg, lat, long, type, display)
}

class Devices {
    constructor() { }
}

Devices.prototype.getDevices = getDevices
Devices.prototype.saveDevice = saveDevice



export default new Devices()