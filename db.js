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
    let date = new Date()
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
      answ.push( {...value, points: res2.rows});
    } 
   
    return answ
  }


  export {storeMeasurement,updateConfig, storePoint, getDevicesOrg, newDevice, getOrganizations, getVariables, newRoute, finishRoute, getRoutesDevice};