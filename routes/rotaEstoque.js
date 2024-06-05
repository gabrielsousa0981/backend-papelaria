const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.run(`CREATE TABLE IF NOT EXISTS 
         estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            id_produto int, 
            quantidade REAL, 
            valor_unitario REAL
            )
            `, (createTableError) => {
    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }
});

// Consultar todos os dados
router.get("/", (req, res, next) => {
    db.all('SELECT * FROM estoque', (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está a lista de todo o Estoque",
            produtos: rows
        });
    });
});

// Consultar apenas uma entrada pelo id
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM estoque WHERE id = ?', [id], (error, row) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está o cadastro do Estoque",
            produto: row
        });
    });
});

// Salvar dados da entrada
router.post("/", (req, res, next) => {
    const { id_produto, quantidade, valor_unitario } = req.body;
    db.serialize(() => {
        const insertEstoque = db.prepare(`
        INSERT INTO estoque(id_produto, quantidade, valor_unitario) 
        VALUES(?, ?, ?)`);
        insertEstoque.run(id_produto, quantidade, valor_unitario, (err) => {
            if (err) {
                return res.status(500).send({
                    error: err.message
                });
            }

            res.status(200).send({ mensagem: "Estoque salvo com sucesso!" });
        });
        insertEstoque.finalize();
    });
});

// Alterar dados da entrada
router.put("/", (req, res, next) => {
    const { id, id_produto, quantidade, valor_unitario } = req.body;
    db.run(`UPDATE estoque SET 
                id_produto = ?, 
                quantidade = ?, 
                valor_unitario = ? 
            WHERE id = ?`, [id_produto, quantidade, valor_unitario, id], (error) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({ mensagem: "Dados do Estoque salvos com sucesso!" });
    });
});

// Deletar cadastro por id
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    db.run('DELETE FROM estoque WHERE id = ?', [id], (error) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({ mensagem: "Entrada deletada com sucesso!" });
    });
});

module.exports = router;
