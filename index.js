import { DATABASE,DB_USER,PASS,HOST } from "./secrets.js";
import mqtt from 'mqtt';
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
var mqtt_client  = mqtt.connect('mqtt://localhost')

mqtt_client.on('connect', function () {
  mqtt_client.subscribe('AQ/+/#', function (err) {
    
  })
})

mqtt_client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString()+"/"+message.toString())
  let info = topic.split("/")
  let messageType = info[info.length-3]
  let id =parseInt( info[info.length-2])
  let variable = info[info.length-1]
  console.log("Message-Type:"+messageType)

  switch(messageType){
    case "Measurement":
      storeMeasurement(id, variable,message);
      break;
    case "Config":
      updateConfig(id, variable, message);
      break;
  }
  
})

const storeMeasurement = function(id,variable, value) {
  console.log("SAVING..")
  console.log("ID:"+id)
  console.log("VARIABLE:"+variable)
  console.log("VALUE:"+value)
  let date = new Date()
  let pool = new Pool(connectionData);
  pool.query(
    "INSERT INTO measurement(timestamp, variable, device, value)VALUES('"+date.toISOString()+"', '"+1+"', "+id+", "+value+")",
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
