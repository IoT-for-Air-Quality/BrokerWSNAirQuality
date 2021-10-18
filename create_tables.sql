CREATE TABLE organization(
	id serial PRIMARY KEY,
	name VARCHAR (100),
	lat float,
	long float
);

CREATE TABLE variable(
	id serial PRIMARY KEY,
	name VARCHAR(100),
	unit VARCHAR(50)
);

CREATE TABLE device(
	id serial PRIMARY KEY,
	lat float,
	long float,
	type VARCHAR(6),
	organization INT,
	display BOOLEAN,
	FOREIGN KEY (organization)
      		REFERENCES organization (id)
);
ALTER TABLE device 
   ADD CONSTRAINT check_types 
   CHECK (type = 'static' OR type = 'mobile');

CREATE TABLE measurement(
	id serial PRIMARY KEY,
	timestamp TIMESTAMP,
	variable INT,
	device INT,
	value float,
	FOREIGN KEY (variable)
      		REFERENCES variable (id),
	FOREIGN KEY (device)
      		REFERENCES device (id)
	
);

CREATE TABLE route(
	id serial PRIMARY KEY,
	device INT,
	startTimestamp TIMESTAMP,
	endTimestamp TIMESTAMP,
	update_frecuency INT,
	FOREIGN KEY (device)
      		REFERENCES device (id)
);

CREATE TABLE route_point(
	id serial PRIMARY KEY,
	lat float,
	long float,
	route INT,
	FOREIGN KEY (route)
      		REFERENCES route (id)
);