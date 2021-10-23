
import {getOrganizations} from '../db.js';

async function listOrganizations() {
    
    return await getOrganizations();
}

class Organizations {
    constructor() { }
}

Organizations.prototype.listOrganizations = listOrganizations




export default new Organizations()