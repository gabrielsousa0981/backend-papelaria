const express = require('express')
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}))
const morgan = require("morgan");
app.use(morgan("dev"));

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Autorization"

    );
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send({});
    }
    next();
})
const rotaUsuario = require("./routes/rotaUsuario");

app.use("/usuario",rotaUsuario)

module.exports = app


