
import {getRoutesDevice, newRoute, finishRoute } from '../db.js';

async function getRoutes(device) {
    
    return await getRoutesDevice(device);
}

async function saveRoute(device, update_frecuency) {
    return await newRoute(device, update_frecuency)
}

async function endRoute(id) {
    return await finishRoute(id)
}

class Routes {
    constructor() { }
}

Routes.prototype.getRoutes= getRoutes
Routes.prototype.saveRoute = saveRoute
Routes.prototype.endRoute = endRoute



export default new Routes()