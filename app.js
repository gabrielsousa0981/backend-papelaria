const express = require('express')

const app = express();

app.use((req, res, next)=>{

    res.send("minha api")

})


module.exports = app