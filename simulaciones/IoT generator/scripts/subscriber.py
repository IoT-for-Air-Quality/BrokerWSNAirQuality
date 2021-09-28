 

import time

node.subscribe("AQ/ESP32/+")

def callback(topic, message):
	node.mark(message)

while node.loop():
	time.sleep(1)