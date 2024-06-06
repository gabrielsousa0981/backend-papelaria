const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
db.run(`CREATE TABLE IF NOT EXISTS 
         estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            id_produto int, 
            quantidade Real, 
            valor_unitario Real,
            total Real
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
db.all('SELECT * FROM estoque', (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está a lista de todo Estoque",
            produtos: rows
        });
    });
})

//consultar apenas uma entrada pelo id
router.get("/:id",(req,res,next)=>{
    const {id} = req.params;
    db.get('SELECT * FROM estoque where id=?',[id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está o cadastro da estoque",
            produto: rows
        });
    });
})

// aqui salvamos dados da entrada
router.post("/",(req,res,next)=>{
    const { id_produto, quantidade, valor_unitario, data_saida }
     = req.body;
   db.serialize(() => {
        const insertEstoque = db.prepare(`
        INSERT INTO saida(id_produto, quantidade, valor_unitario) 
        VALUES(?,?,?)`);
        insertEstoque.run(id_produto, quantidade, valor_unitario);
        insertEstoque.finalize();
    });
    process.on("SIGINT", () => {
        db.close((err) => {
            if (err) {
                return res.status(304).send(err.message);
            }
        });
    });

    res.status(200)
    .send({ mensagem: "Estoque salvo com sucesso!" });
});

// aqui podemos alterar dados da entrada
router.put("/",(req,res,next)=>{
    const {id,id_produto, quantidade, valor_unitario} = req.body;
                db.run(`UPDATE estoque SET 
                            id_produto=?,
                            quantidade=?,
                            valor_unitario=? 
            where id=?`,[id_produto,quantidade,valor_unitario,id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send(
            { mensagem: "Dados do Estoque salvos com sucesso!" 
            });
    });
});
 // Aqui podemos deletar o cadastro de um usuário por meio do id
router.delete("/:id",(req,res,next)=>{
    const {id} = req.params
    db.run('DELETE FROM estoque where id=?',[id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send(
            { mensagem: "Estoque deletado com sucesso!" 
            });
    });


});
module.exports = router;