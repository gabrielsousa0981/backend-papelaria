const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
db.run(`CREATE TABLE IF NOT EXISTS 
         saida (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            id_produto int, 
            quantidade Real, 
            valor_unitario Real,
            data_saida Date
            )
            `, (createTableError) => {
    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }
});


//consultar todos os dados
router.get("/",(req,res,next)=>{
db.all('SELECT * FROM saida', (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está a lista de todas as Saídas",
            produtos: rows
        });
    });
})

//consultar apenas uma entrada pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM saida where id=?',[id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está o cadastro da Saída",
            produto: rows
        });
    });
})

// aqui salvamos dados da entrada
router.post("/",(req,res,next)=>{
    const { id_produto, quantidade, valor_unitario, data_saida }
     = req.body;
   db.serialize(() => {
        const insertSaida = db.prepare(`
        INSERT INTO saida(id_produto, quantidade, valor_unitario,data_saida) 
        VALUES(?,?,?,?)`);
        insertSaida.run(id_produto, quantidade, valor_unitario,data_saida);
        insertSaida.finalize();
    });
    process.on("SIGINT", () => {
        db.close((err) => {
            if (err) {
                return res.status(304).send(err.message);
            }
        });
    });

    res.status(200)
    .send({ mensagem: "Saída salvo com sucesso!" });
});

// aqui podemos alterar dados da entrada
router.put("/",(req,res,next)=>{
    const {id,id_produto, quantidade, valor_unitario,data_saida} = req.body;
                db.run(`UPDATE saida SET 
                            id_produto=?,
                            quantidade=?,
                            valor_unitario=?,
                            data_saida=?  
            where id=?`,[id_produto,quantidade,valor_unitario,data_saida,id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send(
            { mensagem: "Dados da Saída salvos com sucesso!" 
            });
    });
});
 // Aqui podemos deletar o cadastro de um usuário por meio do id
router.delete("/:id",(req,res,next)=>{
    const {id} = req.params
    db.run('DELETE FROM saida where id=?',[id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send(
            { mensagem: "Entrada deletada com sucesso!" 
            });
    });


});
module.exports = router;