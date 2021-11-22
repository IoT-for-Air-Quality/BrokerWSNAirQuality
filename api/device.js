
import {getDevicesOrg,getDevicesValues, newDevice} from '../db.js';

async function getDevices(idOrg) {
    
    return await getDevicesOrg(idOrg);
}
async function getDevicesWithProm(idOrg, startDate, endDate ) {
    let respuesta = [];
    let valores= [];
    valores= await getDevicesValues(idOrg, startDate, endDate);
    valores.forEach(element => {
        
        if(!respuesta.find(r=>r.id==element.id)){
            let promCO = valores.find(e=>e.id==element.id && e.name =='CO');
            let promCO2 = valores.find(e=>e.id==element.id && e.name =='CO2');
            let promPM25 = valores.find(e=>e.id==element.id && e.name =='PM2.5');
            let objeto ={...element, promedioCO: !(promCO===undefined)?promCO.promedio:null,
                
                promedioCO2: !(promCO2===undefined)?promCO2.promedio:null,
                promedioPM25: !(promPM25===undefined)?promPM25.promedio:null
                 };


            respuesta.push(objeto)
        }

        
        
    });
    return respuesta;
}

async function saveDevice(idOrg, lat, long, type, display) {
    return await newDevice(idOrg, lat, long, type, display)
}

class Devices {
    constructor() { }
}

Devices.prototype.getDevices = getDevices
Devices.prototype.getDevicesWithProm = getDevicesWithProm
Devices.prototype.saveDevice = saveDevice



export default new Devices()