## Before You Begin

Before you begin we recommend you read about the basic building blocks:

* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.

* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.Please use Node JS version 7 or higher

* DCMCHEE - Go through [dcm4che Official Website](http://www.dcm4che.org/) 


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
 
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.

* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).


## Quick Install


The  `package.json`  files that contain the list of modules you need to start your application.

To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

This command does a few things:

* First it will install the dependencies needed for the application to run.

* If you're running in a development environment, it will then also install development dependencies needed for  running your application.

* To update these packages later on, just run `npm update`

## Running Your Application


Before Start application in local enviorment change the following fields in `config/development.json` .

1.hostIp  - DCMCHEE server host name / IP address

2.host -  MySQL host name / IP address

3.mongodburi -  MongoDB connection URI used to connect to a MongoDB database server

4.admin_user - MySQL user name

5.admin_password - MySQL password

6.dcm_root - DCMCHEE server archive path

Run your application using npm:


```bash
$ npm start
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

Explore `config/development.json` for development environment configuration options.

Setup testing enviornment locally follow the steps

Before running your app, you can do this in console,

    export NODE_ENV=testing

Or if you are in windows you could try this:

    SET NODE_ENV=testing

If server started sucessfully  create a default admin user created. using the following credentials used for login
	
		admin@directradiology.com / password






