
import {getVariables} from '../db.js';

async function listVariables() {
    
    return await getVariables();
}

class Variables {
    constructor() { }
}

Variables.prototype.listVariables = listVariables




export default new Variables()