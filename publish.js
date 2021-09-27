var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  for (i=0; i<=9; i++){
    setTimeout(()=>{
      client.publish('AQ/ML/CO', `${Math.round(Math.random()*1000)}`)
    },1000)
  }
})



