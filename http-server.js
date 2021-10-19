import http from 'http';
import qs from 'querystring'
import url from 'url'
import Devices from './api/device.js'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        return handleGetReq(req, res)
    } else if (req.method === 'POST') {
        return handlePostReq(req, res)
    } 
})

async function handleGetReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org } = qs.parse(query)
    console.log(org)
    if (pathname !== '/users') {
        return handleError(res, 404)
    }
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Devices.getDevices(org)))
}

async function handlePostReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org, lat, long, type, display } = qs.parse(query)
    if (pathname !== '/user') {
        return handleError(res, 404)
    }
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