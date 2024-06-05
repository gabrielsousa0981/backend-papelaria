const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.run(`CREATE TABLE IF NOT EXISTS 
         entrada (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            id_produto int, 
            quantidade Real, 
            valor_unitario Real,
            data_entrada Date
            )`, (createTableError) => {
    if (createTableError) {
        console.error("Erro ao criar tabela de entrada:", createTableError.message);
    }
});

// Consultar todos os dados
router.get("/", (req, res, next) => {
    db.all('SELECT * FROM entrada', (error, rows) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de todas as Entradas",
            produtos: rows
        });
    });
});

// Consultar apenas uma entrada pelo id
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM entrada where id=?', [id], (error, row) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({
            mensagem: "Aqui está o cadastro da Entrada",
            produto: row
        });
    });
});

// Salvar dados da entrada
router.post("/", (req, res, next) => {
    const { id_produto, quantidade, valor_unitario, data_entrada } = req.body;
    db.serialize(() => {
        const insertEntrada = db.prepare(`
        INSERT INTO entrada(id_produto, quantidade, valor_unitario,data_entrada) 
        VALUES(?,?,?,?)`);
        insertEntrada.run(id_produto, quantidade, valor_unitario, data_entrada);
        insertEntrada.finalize();



    });

    process.on("SIGINT", () => {
        db.close((err) => {
            if (err) {
                return res.status(304).send(err.message);
            }
        });
    });

   

    res.status(200)
    .send({ mensagem: "Entrada salvo com sucesso!" })
});

function atualizarestoque(id_produto,quantidade,valor_unitario){

    db.get('SELECT * FROM estoque where id_produto=?', [id_produto], (error, row) => {
        if (error) {
            return res.status(500).send({

                error: error.message 

                });
        }

        if(rows.length>0){

            // atualizar a quantidade no estoque 1
            // acrescentando a quantidade inserida em entrada 1
            const quantidadeestoque=rows[0].quantidade;
            const quantidadeatualizada=parseFloat(quantidade)+parseFloat(quantidadeestoque);
            db.serialize(() => {
                //const total = quantidade*valor_unitario
                const updateEstoque = db.prepare(`
                UPDATE estoque SET  quantidade=?, valor_unitario=? Where id_produto=?`);
                updateEstoque.run(quantidadeatualizada, valor_unitario, id_produto);
                updateEstoque.finalize();
        
        
        
            });

        }else{
            //insira a mesma quantidade inserida em entrada 
            db.serialize(() => {
                //const total = quantidade*valor_unitario
                const insertEstoque = db.prepare(`
                INSERT INTO estoque(id_produto, quantidade, valor_unitario) 
                VALUES(?,?,?,?)`);
                insertEstoque.run(id_produto, quantidade, valor_unitario, data_entrada);
                insertEstoque.finalize();
        
        
        
            });
        }
    });

}

// Aqui podemos alterar dados da entrada
router.put("/", (req, res, next) => {
    const { id, id_produto, quantidade, valor_unitario, data_entrada } = req.body;
    db.run(`UPDATE entrada SET 
                id_produto=?,
                quantidade=?,
                valor_unitario=?,
                data_entrada=?  
            where id=?`, [id_produto, quantidade, valor_unitario, data_entrada, id], (error, rows) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: "Dados da Entrada salvos com sucesso!" });
    });
});

// Aqui podemos deletar o cadastro de uma entrada por meio do id
router.delete("/:id", (req, res, next) => {
    const { id } = req.params
    db.run('DELETE FROM entrada where id=?', [id], (error, rows) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: "Entrada deletada com sucesso!" });
    });
});

// Fechar o banco de dados quando o servidor é encerrado
process.on("SIGINT", () => {
    db.close((err) => {
        if (err) {
            console.error("Erro ao fechar o banco de dados:", err.message);
        }
    });
});

module.exports = router;
