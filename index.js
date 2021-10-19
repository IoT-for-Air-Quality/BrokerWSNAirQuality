import mqtt from 'mqtt';
import {storeMeasurement,updateConfig} from './db.js';
import server from './http-server.js'



var mqtt_client  = mqtt.connect('mqtt://35.237.59.165')

mqtt_client.on('connect', function () {
  mqtt_client.subscribe('AQ/+/#', function (err) {
    
  })
})




mqtt_client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString()+"/"+message.toString())
  let info = topic.split("/")
  let messageType = info[1]
  let id =parseInt( info[2])
  let variable = info[3]
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
