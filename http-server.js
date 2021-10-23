import http from 'http';
import qs from 'querystring'
import url from 'url'
import Devices from './api/device.js'
import Organizations from './api/organization.js'
import Variables from './api/variables.js'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url)
    switch(pathname){
        case "/device":
            if (req.method === 'GET') {
                return handleGetReq(req, res)
            } else if (req.method === 'POST') {
                return handlePostReq(req, res)
            } 
            break;
        case "/organization":
            if (req.method === 'GET') {
                return handleGetOrganizationReq(req, res)
            } else if (req.method === 'POST') {
                return handlePostOrganizationReq(req, res)
            }
            break;

        case "/variable":
            if (req.method === 'GET') {
                return handleGetVariableReq(req, res)
            } else if (req.method === 'POST') {
                return handlePostVariableReq(req, res)
            }

            break;


        default:
            return handleError(res, 404)
            break;
    }
    
})

async function handleGetReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Devices.getDevices(org)))
}

async function handlePostReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org, lat, long, type, display } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Devices.saveDevice(org,lat,long,type,display)))
}


async function handleGetOrganizationReq(req, res) {
    console.log('AAA')
    const { pathname, query } = url.parse(req.url)
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Organizations.listOrganizations()))
}

async function handlePostOrganizationReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org, lat, long, type, display } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Devices.saveDevice(org,lat,long,type,display)))
}


async function handleGetVariableReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Variables.listVariables()))
}

async function handlePostVariableReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org, lat, long, type, display } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Devices.saveDevice(org,lat,long,type,display)))
}





function handleError (res, code) { 
    res.statusCode = code 
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`) 
} 

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

export default{server}