#Publisher
import random
import time
while node.loop():
	node.publish("AQ/CC_NM"+str(node.id())+"/CO", random.randint(400, 600))
	node.publish("AQ/CC_NM"+str(node.id())+"/Lat", node.latitude)
	node.publish("AQ/CC_NM"+str(node.id())+"/Long", node.longitude)
	time.sleep(random.randint(10, 20))