const express = require("express");
const router = express.Router();        

const usuario =[
{

    id:1,
    nome:"joao"

},
{

    id:2,
    nome:"pedro"


},
]

//consultar todos os dados
router.get("/",(req,res,next)=>{
   res.send(
     {

        mensagem:"lista de usuários",
        usuarios:usuario

    }
   )



})





























module.exports = router;