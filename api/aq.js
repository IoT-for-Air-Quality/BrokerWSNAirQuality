
import { getAQInfo } from '../db.js';

async function getInfo(latitude, longitude, radius) {
    let respuesta = [];
    let valores= [];
    valores= await getAQInfo(latitude, longitude, radius);
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
    
    return respuesta.filter((device)=>device.distance<radius/1000);
    
}



class AQ {
    constructor() { }
}

AQ.prototype.getInfo = getInfo



export default new AQ()