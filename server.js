// #constantes::

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credential');
const verifyJwt = require('./middlewares/verifyJwt');


const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
// custom middleware
app.use(require('./middlewares/logs').requestLog);

// credential
app.use(credentials);

// cores handler
app.use(cors(require('./config/corsOption')));
// app.use(cors());

/*build middlewares
*   form url encode data
*   json parsing
*/
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// middlewares for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname,"public")));

// routes
app.use('/login', require('./routes/api/loginRoute'));
app.use('/login-single' , require('./routes/api/loginSingleRoute'))
app.use('/logout', require('./routes/api/logoutRoute'));

app.use('/refresh' , require('./routes/api/refreshTokenRoute'));

app.use(verifyJwt);

app.use('/user/profile',require('./routes/api/userRoute'));
app.use('/admin/dashboard-info',require('./routes/api/infoRoute'));
app.use('/admin/hospitals', require('./routes/api/hospitalAdminRoute'));
app.use('/hospital', require('./routes/api/hospitalRoute'));
app.use('/hospital/emergency', require('./routes/api/emergencyRoute'));
app.use('/hospital/position', require('./routes/api/positionRoute'));
app.use('/hopital/doctors', require('./routes/api/doctorRoute'));
app.use('/patient', require('./routes/api/patientRoute'));
app.use('/alerte' , require('./routes/api/alerteRoute'));
app.use('/antecedents', require('./routes/api/antecedentRoute'));

app.all('*' , require('./routes/404').error404);

// error handler
app.use(require('./middlewares/errorHandler').erroHandler);

io.on('connection' , (socket)=> {
    console.log('user connected' , socket.id);
})

const $_PORT = process.env.API_PORT || 5050;
app.listen($_PORT , "0.0.0.0" , ()=> console.log(`le serveur a démaré sur ${process.env.API_URL}:${$_PORT}`));
