
import {getDevicesOrg, newRoute, finishRoute } from '../db.js';

async function getRoute() {
    
    return await getDevicesOrg(1);
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

Routes.prototype.getRoute= getRoute
Routes.prototype.saveRoute = saveRoute
Routes.prototype.endRoute = endRoute



export default new Routes()