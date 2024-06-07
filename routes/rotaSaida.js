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
            saidas: rows
        });
    });
})

//consultar apenas uma saida pelo id
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
            saida: rows
        });
    });
})

// aqui salvamos dados da saida
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


            atualizarestoque(id_produto,quantidade);



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



function atualizarestoque(id_produto,quantidade,valor_unitario){
   
    db.get('SELECT * FROM estoque where id_produto=?',
    [id_produto], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
      
      if(rows){
        
        // atualizar a quantidade no estoque 1
        // acrescentando a quantidade inserida em saida 1
        const quantidadeestoque=rows.quantidade;
            if(quantidadeestoque<quantidade ||quantidadeestoque===0){
             return res.status(404).send({
                mensagem: "Quantidade é menor que a quantidade no estoque"
            });
          }

        const quantidadeatualizada=parseFloat(quantidadeestoque-quantidade);
        db.serialize(() => {
            //const total = quantidade*valor_unitario
            const updateEstoque = db.prepare(`
            UPDATE estoque SET  quantidade=? Where id_produto=?`);
            updateEstoque.run(quantidadeatualizada, id_produto);
            updateEstoque.finalize();
            
            
        });
        
      }else{
        //produto nao encontrado
        return res.status(404).send({
            mensagem: "Produto nao foi encontrado no estoque"
        });
      }

    });
}

// aqui podemos alterar dados da saida
router.put("/",(req,res,next)=>{
    const {id,id_produto, quantidade, valor_unitario,data_saida} = req.body;
                db.run(`UPDATE saida SET 
                            id_produto=?,
                            quantidade=?,
                            valor_unitario=?,
                            data_saida=?  
            where id=?`,[id_produto,quantidade,valor_unitario,data_saida,id],
             (error, rows) => {
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
 // Aqui podemos deletar o cadastro de uma saida por meio do id
router.delete("/:id",(req,res,next)=>{
    const {id} = req.params
    db.run('DELETE FROM saida where id=?',[id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send(
            { mensagem: "Saida deletada com sucesso!" 
            });
    });


});
module.exports = router;