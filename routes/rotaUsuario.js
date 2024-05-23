const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.run(`CREATE TABLE IF NOT EXISTS
 usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT)
    `, (createTableError) => {

    if (createTableError) {
         return res.status(500).send({
                error: createTableError.message
        });
    }

});



const usuarios=["joão","pedro"]

const usuario=[

{

    id:1,
    nome:"joão"

},

{

    id:2,
    nome:"pedro"


},
]

//consultar todos os dados
router.get("/", (req, res, next) => {
    db.all('SELECT * FROM usuario', (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de todos os usuários",
            usuarios: rows
        });
    });
    // Aqui, você pode adicionar código para fechar a conexão com o banco de dados, se necessário.
    // Exemplo:
    // db.close(); // Fechar conexão com o banco de dados
});




// aqui salvamos dados do usuário
router.post("/",(req,res,next)=>{


});

// aqui podemos alterar dados do usuário
router.put("/",(req,res,next)=>{

});
 // Aqui podemos deletar o cadastro de um usuário por meio do id
router.delete("/:id",(req,res,next)=>{

});
module.exports = router