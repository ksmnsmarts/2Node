const path = require('path')
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* -----------------------------------------
    npm run test 
    npm run prod
----------------------------------------- */ 
if(process.env.NODE_ENV.trim() === 'production') {
  require('dotenv').config({ path: path.join(__dirname, '/env/prod.env') });
} else if(process.env.NODE_ENV.trim() === 'development') {
  require('dotenv').config({ path: path.join(__dirname, '/env/dev.env') });
}


/* -----------------------------------------
    PORT
----------------------------------------- */ 
var port = normalizePort(process.env.PORT);
app.set('port', port);

/* -----------------------------------------
    DB
----------------------------------------- */ 
const mongApp = require('./database/mongoDB');


// [API] Routers
app.use('/api/v1', require('./routes/api/v1'));

// static
app.use('/', express.static(path.join(__dirname, '/dist/client')));


http.createServer(app).listen(app.get('port'), () => {
	console.log(` 
    +---------------------------------------------+
    |                                                 
    |      [ Potatocs Server ]
    |
    |      - Version:`,process.env.VERSION,`        
    |
    |      - Mode: ${process.env.MODE}
    |                                      
    |      - Server is running on port ${app.get('port')}
    |
    +---------------------------------------------+
    `);

	/*----------------------------------
	    CONNECT TO MONGODB SERVER
	------------------------------------*/
	mongApp.appSetObjectId(app);
});

function normalizePort(val) {
	var port = parseInt(val, 10);
  
	if (isNaN(port)) {
	  // named pipe
	  return val;
	}
  
	if (port >= 0) {
	  // port number
	  return port;
	}
  
	return false;
  }


app.use(function(req, res) {
    console.log(`
    ============================================
		>>>>>> Invalid Request! <<<<<<

		Req: "${req.url}"
		=> Redirect to 'index.html'
    ============================================`)
	res.sendFile(__dirname+'/client/index.html');
});