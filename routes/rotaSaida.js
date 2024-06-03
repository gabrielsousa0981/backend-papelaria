const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

// Criação da tabela de saídas, se ainda não existir
db.run(`CREATE TABLE IF NOT EXISTS
    saida_produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    quantidade INTEGER,
    valor_unitario REAL,
    data_saida DATE)
    `, (createTableError) => {
    if (createTableError) {
        console.error("Erro ao criar a tabela de saídas:", createTableError.message);
    }
});

// Rota para consultar todas as saídas
router.get("/", (req, res, next) => {
    db.all('SELECT * FROM saida_produto', (error, rows) => {
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
});

// Rota para consultar uma saída pelo ID
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM saida_produto WHERE id=?', [id], (error, row) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está o cadastro da Saída",
            saida: row
        });
    });
});

// Rota para salvar uma nova saída
router.post("/", (req, res, next) => {
    const { produto_id, quantidade, valor_unitario, data_saida } = req.body;
    db.run(`INSERT INTO saida_produto (produto_id, quantidade, valor_unitario, data_saida) 
            VALUES (?, ?, ?, ?)`,
        [produto_id, quantidade, valor_unitario, data_saida],
        (error) => {
            if (error) {
                console.error("Erro ao inserir saída de produto:", error.message);
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({ mensagem: "Saída de produto registrada com sucesso!" });
        });
});

// Rota para alterar dados de uma saída existente
router.put("/", (req, res, next) => {
    const { id, produto_id, quantidade, valor_unitario, data_saida } = req.body;
    db.run(`UPDATE saida_produto 
            SET produto_id=?, quantidade=?, valor_unitario=?, data_saida=?
            WHERE id=?`,
        [produto_id, quantidade, valor_unitario, data_saida, id],
        (error) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({ mensagem: `Saída de id: ${id} dados alterados com sucesso!` });
        });
});

// Rota para deletar uma saída pelo ID
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    db.run('DELETE FROM saida_produto WHERE id=?', [id], (error) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: `Saída de id: ${id} deletada com sucesso!` });
    });
});

module.exports = router;
