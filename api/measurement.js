
import {getMeasurements, postMeasurements} from '../db.js';

async function listMeasurement(device, startDate, endDate) {
    
    return await getMeasurements(device, startDate, endDate);
}

async function insertMeasurement(timestamp, variable ,device, value) {
    
    return await postMeasurements(timestamp, variable ,device, value);
}

class Measurement {
    constructor() { }
}

Measurement.prototype.listMeasurement = listMeasurement
Measurement.prototype.insertMeasurement = insertMeasurement




export default new Measurement()