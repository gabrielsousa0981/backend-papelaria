const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

// Criação da tabela de produtos
db.run(`CREATE TABLE IF NOT EXISTS
    produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto TEXT,
    quantidade INT,
    valor_unitario REAL,
    total REAL)
    `, (createTableError) => {

    if (createTableError) {
        console.error('Erro ao criar a tabela:', createTableError.message);
    } else {
        console.log('Tabela de produtos criada com sucesso!');
    }

});

// Consultar todos os produtos
router.get("/", (req, res, next) => {
    db.all('SELECT * FROM produto', (error, rows) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de todos os Produtos",
            produtos: rows
        });
    });
});

// Consultar apenas um produto pelo id
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM produto WHERE id=?', [id], (error, row) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({
            mensagem: "Aqui está o cadastro do Produto",
            produto: row
        });
    });
});

// Aqui salvamos dados do produto
router.post("/", (req, res, next) => {
    const { produto, quantidade, valor_unitario } = req.body;

    db.run(`
        INSERT INTO produto(produto, quantidade, valor_unitario, total) 
        VALUES(?,?,?,?)
    `, [produto, quantidade, valor_unitario, quantidade * valor_unitario], function(error) {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: "Produto salvo com sucesso!" });
    });
});

// Aqui podemos alterar dados do produto
router.put("/:id", (req, res, next) => {
    const { id } = req.params;
    const { produto, quantidade, valor_unitario } = req.body;

    db.run(`
        UPDATE produto 
        SET produto=?, quantidade=?, valor_unitario=?, total=?
        WHERE id=?
    `, [produto, quantidade, valor_unitario, quantidade * valor_unitario, id], function(error) {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: `Produto de ID ${id} alterado com sucesso!` });
    });
});

// Aqui podemos deletar o cadastro de um produto por meio do id
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    db.run('DELETE FROM produto WHERE id=?', [id], function(error) {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ mensagem: `Produto de ID ${id} deletado com sucesso!` });
    });
});

// Rota para atualizar o estoque e calcular o valor total de um produto pelo ID
router.put("/estoque/:id", (req, res, next) => {
    const { id } = req.params;
    const { quantidade, valor_unitario } = req.body;

    // Verifica se a quantidade e o valor unitário são números válidos
    if (isNaN(quantidade) || isNaN(valor_unitario)) {
        return res.status(400).send({ error: 'A quantidade e o valor unitário devem ser números válidos.' });
    }

    // Consulta o produto pelo ID
    db.get('SELECT * FROM produto WHERE id = ?', [id], (error, row) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        // Verifica se o produto existe
        if (!row) {
            return res.status(404).send({ error: 'Produto não encontrado.' });
        }

        // Calcula o novo estoque e o novo total
        const novoEstoque = row.quantidade + quantidade;
        const novoTotal = row.total + (quantidade * valor_unitario);

        // Atualiza o estoque e o total do produto no banco de dados
        db.run('UPDATE produto SET quantidade = ?, total = ? WHERE id = ?', [novoEstoque, novoTotal, id], (error) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            // Retorna uma mensagem de sucesso
            res.status(200).send({
                mensagem: `Estoque e total do produto com ID ${id} atualizados com sucesso.`
            });
        });
    });
});

module.exports = router;
