import http from 'http';
import qs from 'querystring'
import url from 'url'
import Devices from './api/device.js'
import Organizations from './api/organization.js'
import Variables from './api/variables.js'
import Routes from './api/route.js'
import Measurement from './api/measurement.js';

import AQ from './api/aq.js';

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

        case "/measurement":
            if (req.method === 'GET') {
                return handleGetMeasurementReq(req, res)
            } else if (req.method === 'POST') {
                return handlePostMeasurementReq(req, res)
            }
            break;

        case "/file":
            if (req.method === 'POST') {
                
                return handlePostFile(req, res)
            }
            break;
            
        case "/route":
                if (req.method === 'GET') {
                    return handleGetRouteReq(req, res)
                } else if (req.method === 'POST') {
                    return handlePostRouteReq(req, res)
                }else if (req.method === 'PUT') {
                    return handlePutEndRouteReq(req, res)
                }
            break;

        case "/AQ":
                if (req.method === 'GET') {
                    return handleGetAQReq(req, res)
                } 
            break;


        default:
            return handleError(res, 404)
            break;
    }
    
})
//Devices
async function handleGetReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org, startDate, endDate } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    if(startDate!=null){
        return res.end(JSON.stringify(await Devices.getDevicesWithProm(org, startDate, endDate )))
    }else{
        return res.end(JSON.stringify(await Devices.getDevices(org)))
    }
}

async function handlePostReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { org, lat, long, type, display } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Devices.saveDevice(org,lat,long,type,display)))
}

//Organizations
async function handleGetOrganizationReq(req, res) {
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

//Variables
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


//Measurements
async function handleGetMeasurementReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { device, startDate, endDate } = qs.parse(query)
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Measurement.listMeasurement(device,startDate,endDate)))
}

async function handlePostMeasurementReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { timestamp, variable ,device, value} = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Measurement.insertMeasurement(timestamp, variable ,device, value)))
}

//Files

function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            // listen to data sent by client
            req.on("data", (chunk) => {
                // append the string version to the body
                body += chunk.toString();
            });
            // listen till the end
            req.on("end", () => {
                // send back the data
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function handlePostFile(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { device } = qs.parse(query)
    // var body = '';
    let todo_data =  await getReqData(req);
    // console.log(JSON.parse(todo_data));
    // req.on('data', function (data) {
    //     body += data;

    //     // Too much POST data, kill the connection!
    //     // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    //     if (body.length > 1e6)
    //         request.connection.destroy();
    // });

    
    // req.on('end', function () {
    //     var post = qs.parse(body);
    //     console.log(post);
    //     console.log(post['a']);
        
    //     // use post['blah'], etc.
    // });

    
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    // return res.end(JSON.stringify(await Measurement.insertMeasurement(timestamp, variable ,device, value)))
}

//Routes
async function handleGetRouteReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { device } = qs.parse(query)
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Routes.getRoutes(device)));
}

async function handlePostRouteReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { device, update_frecuency } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Routes.saveRoute(device, update_frecuency)));
}
async function handlePutEndRouteReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { id } = qs.parse(query)
    
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await Routes.endRoute(id)));
}

//AQ
async function handleGetAQReq(req, res) {
    const { pathname, query } = url.parse(req.url)
    const { latitude, longitude, radius } = qs.parse(query)
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    return res.end(JSON.stringify(await AQ.getInfo(latitude,longitude, radius)));
}

//Error 
function handleError (res, code) { 
    res.statusCode = code 
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`) 
} 

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

export default{server}