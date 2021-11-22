import { DATABASE,DB_USER,PASS,HOST } from "./secrets.js";
import pg from 'pg'

const {Pool,Client} = pg

const connectionData = {
    user: DB_USER,
    host: HOST,
    database: DATABASE,
    password: PASS,
    port: 5432,
  }

const db_client = new Client(connectionData)
db_client.connect()

const storeMeasurement = function(id,variable, value) {
    console.log("SAVING..")
    console.log("ID:"+id)
    console.log("VARIABLE:"+variable)
    console.log("VALUE:"+value)
    let variableId=0
    switch(variable){
        case 'CO':
            variableId=1;
            break;
        case 'CO2':
            variableId=2;
            break;
        case 'PM2.5':
            variableId=3;
            break;
        default:
            variableId=4;

    }
    console.log(variableId)
    let date = new Date();
    //GTM-5 Bogota
    date.setHours(date.getHours() - 5);
    let pool = new Pool(connectionData);
    pool.query(
      "INSERT INTO measurement(timestamp, variable, device, value)VALUES('"+date.toISOString()+"', '"+variableId+"', "+id+", "+value+")",
      (err, res) => {
        console.log(err, res);
        pool.end();
      }
    );
  }
  
  
  const updateConfig = function(id,variable, value) {
    console.log("UPDATING..")
    console.log("ID:"+id)
    console.log("VARIABLE:"+variable)
    console.log("VALUE:"+value)
    let pool = new Pool(connectionData);
    pool.query(
      "UPDATE device SET "+variable+"= "+value+" WHERE id ="+id,
      (err, res) => {
        console.log(err, res);
        pool.end();
      }
    );
  }

  const getDevicesOrg = async function(idOrganization){
    const text = 'SELECT * from device WHERE organization = $1'
    const values = [idOrganization]
    const res = await db_client.query(text, values)
    return res.rows

  }

  const getDevicesValues = async function(idOrganization, startDate, endDate){
    const text = ' SELECT  device.id , AVG(measurement.value) AS promedio, variable.name , device.lat ,device.long , device.type ,device.organization, device.display FROM device INNER JOIN measurement  ON (device.id = measurement.device) INNER JOIN variable ON (measurement.variable = variable.id) WHERE (NOT (measurement.device IS NULL)) and device.organization = $1 AND timestamp >= $2 AND timestamp < $3 GROUP BY 1,3,4,5,6,7,8'
    const values = [idOrganization, startDate, endDate]
    const res = await db_client.query(text, values)
    return res.rows
  }

  const newDevice = async function(idOrganization, lat, long, type, display){
    const text = 'INSERT INTO device(organization,lat,long,type,display) VALUES($1, $2, $3, $4, $5) RETURNING id'
    const values = [idOrganization, lat,long,type,display]
    const res = await db_client.query(text, values)
    return res.rows

  }

  const getOrganizations = async function(){
    const text = 'SELECT * from organization';
    const res = await db_client.query(text);
    return res.rows;

  }

  const getVariables = async function(){
    const text = 'SELECT * from variable';
    const res = await db_client.query(text);
    return res.rows;

  }

  //Routes

  const newRoute = async function(device, update_frecuency){
    const text = 'INSERT INTO route(device,startTimestamp,update_frecuency) VALUES($1, $2, $3) RETURNING id'
    const values = [device, (new Date()).toISOString(), update_frecuency]
    const res = await db_client.query(text, values)
    return res.rows

  }

  const finishRoute = async function(id){
    const text = 'UPDATE  route SET endTimestamp =$1 WHERE id= $2 RETURNING id'
    const values = [(new Date()).toISOString(), id]
    const res = await db_client.query(text, values)
    return res.rows

  }

  const storePoint = async function(id, lat, long){
    const text = 'INSERT INTO route_point(route,lat,long) VALUES($1, $2, $3) RETURNING id'
    const values = [id, lat, long]
    const res = await db_client.query(text, values)
    return res.rows
  }

  const getRoutesDevice = async function(device){
    const text = 'SELECT * from route WHERE device = $1'
    const values = [device]
    const res = await db_client.query(text, values)
    const answ = [];
    for (const value of res.rows) {

      let text2 = 'SELECT * from route_point WHERE route = $1'
      let values2 = [value.id]
      let res2 = await db_client.query(text2, values2)

      let text3 = 'SELECT * from measurement WHERE device = $1 AND timestamp >= $2 AND timestamp < $3';
      let values3 = [device, value.starttimestamp, value.endtimestamp];
      let res3 = await db_client.query(text3, values3)

      answ.push( {...value, points: res2.rows, measurements: res3.rows});
    } 
   
    return answ
  }

  //Measurement

  const getMeasurements= async function(device, startDate, endDate){
    const text = 'SELECT * from measurement WHERE device = $1 AND timestamp >= $2 AND timestamp < $3'
    const values = [device, startDate, endDate]
    return (await db_client.query(text, values)).rows
  }

  const postMeasurements = async function(timestamp,variable, device, value){
    const text = 'INSERT INTO measurement (timestamp, variable, device, value)VALUES($1,$2,$3,$4)'
    const values = [timestamp,variable, device, value]
    return (await db_client.query(text, values)).rows
  }

  //AQ
  const getAQInfo = async function (latitude, longitude, radius){
    let startDate = "2020-10-27T0:25:43.511Z"
    let endDate = "2023-10-27T0:25:43.511Z"
    const text = 'SELECT  device.id , AVG(measurement.value) AS promedio, variable.name , 1.60934*SQRT( POW(69.1 * (device.lat  - $3), 2) + POW(69.1 * ($4 - device.long) * COS(device.lat / 57.3), 2)) AS distance, device.lat ,device.long , device.type ,device.organization, device.display FROM device INNER JOIN measurement  ON (device.id = measurement.device) INNER JOIN variable ON (measurement.variable = variable.id) WHERE (NOT (measurement.device IS NULL)) AND timestamp >= $1 AND timestamp < $2 GROUP BY 1,3,4,5,6,7,8,9'
    const values = [ startDate, endDate, latitude, longitude]
    const res = await db_client.query(text, values)
    return res.rows

  }

  export {storeMeasurement,updateConfig, storePoint, getDevicesOrg, getDevicesValues, newDevice, getOrganizations, getVariables, newRoute, finishRoute, getRoutesDevice, getMeasurements, postMeasurements, getAQInfo};