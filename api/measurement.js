
import {getMeasurements} from '../db.js';

async function listMeasurement(device, startDate, endDate) {
    
    return await getMeasurements(device, startDate, endDate);
}

class Measurement {
    constructor() { }
}

Measurement.prototype.listMeasurement = listMeasurement




export default new Measurement()