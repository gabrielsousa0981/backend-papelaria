const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

// Criação da tabela de entradas, se ainda não existir
db.run(`CREATE TABLE IF NOT EXISTS
    entrada_produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    quantidade INTEGER,
    valor_unitario REAL,
    data_entrada DATE)
    `, (createTableError) => {
    if (createTableError) {
        console.error("Erro ao criar a tabela de entradas:", createTableError.message);
    }
});

// Rota para consultar todas as entradas
router.get("/", (req, res, next) => {
    db.all('SELECT * FROM entrada_produto', (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de todas as Entradas",
            entradas: rows
        });
    });
});

// Rota para consultar uma entrada pelo ID
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM entrada_produto WHERE id=?', [id], (error, row) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está o cadastro da Entrada",
            entrada: row
        });
    });
});

// Rota para salvar uma nova entrada
router.post("/", (req, res, next) => {
    const { produto_id, quantidade, valor_unitario, data_entrada } = req.body;
    db.run(`INSERT INTO entrada_produto (produto_id, quantidade, valor_unitario, data_entrada) 
            VALUES (?, ?, ?, ?)`,
        [produto_id, quantidade, valor_unitario, data_entrada],
        (error) => {
            if (error) {
                console.error("Erro ao inserir entrada de produto:", error.message);
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({ mensagem: "Entrada de produto salva com sucesso!" });
        });
});

// Rota para alterar dados de uma entrada existente
router.put("/", (req, res, next) => {
    const { id, produto_id, quantidade, valor_unitario, data_entrada } = req.body;
    db.run(`UPDATE entrada_produto 
            SET produto_id=?, quantidade=?, valor_unitario=?, data_entrada=?
            WHERE id=?`,
        [produto_id, quantidade, valor_unitario, data_entrada, id],
        (error) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({ mensagem: `Entrada de id: ${id} dados alterados com sucesso!` });
        });
});

// Rota para deletar uma entrada pelo ID
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    db.run('DELETE FROM entrada_produto WHERE id=?', [id], (error) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: `Entrada de id: ${id} deletada com sucesso!` });
    });
});

module.exports = router;
