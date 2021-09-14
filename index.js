var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.subscribe('AQ/+/#', function (err) {
    
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString()+"/"+message.toString())
  //client.end()
})