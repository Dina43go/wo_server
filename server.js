// #constantes::

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credential');
const verifyJwt = require('./middlewares/verifyJwt');

const uniqid= require('uniqid');
const db = require('./config/db');


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

io.use((socket, next) => {
    let userId = socket.handshake.auth.userId;
    if (!userId) {
        userId = socket.handshake.headers.userid;
        if(!userId){
            return next(new Error("invalid userId"));
        }
    }
    console.log(userId);
    socket.userId = userId;
    next();
  });

io.on('connection' , (socket)=> {
    console.log('user connected' , socket.userId , socket.id);

    socket.on('message', data=> console.log(data));
    //all user
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userId: socket.userId
      });
    }
    socket.emit("users", users);

    // // new user
    socket.broadcast.emit("user connected", {
        userId: socket.userId
    });

    console.log(users.length);
    socket.on('alerte', async  (data) => {
        console.log(data);
        // génerer un id alerte // alerteid ,type , referer id 
                                // id for position alerteid
        const alerteId = uniqid();
        const positionId = uniqid();
        // let sql1 = `insert into alerte(alerteId , type , profile_fk) values('${alerteId}' , '${data.type}' , '${data.profile}');`;
        // let sql2 = `insert into positions (PositionId , lng , lat , refererId) values('${positionId}',${data.position.lng},${data.position.lat},'${alerteId}')`;

        await db.query(sql1);
        await db.query(sql2);
        socket.broadcast.emit('alerte' , data);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", socket.userId);
    });
})

const $_PORT = process.env.API_PORT || 5050;
http.listen($_PORT , "0.0.0.0" , ()=> console.log(`le serveur a démaré sur ${process.env.API_URL}:${$_PORT}`));