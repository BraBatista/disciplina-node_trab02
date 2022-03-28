const express = require('express')
const morgan = require('morgan')
const app = express()

const lista_produtos = {
    produtos: [
        { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João"  },
        { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans"  },
        { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé"  },
        { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps"  },
        { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé"  },
    ]
}

// middleware processar o body em formato urlenconded
app.use(express.urlencoded({ extended: true }))

//middleware que processa o body em formato JSON
app.use(express.json())

// middleware de log
app.use(morgan('common'))

//middleware static
//app.use('/app', express.static('public'))

// middleware bem-vindo
app.get('/', (req, res, next) => {
    res.send('Bem-vindo à API Node.JS - trabalho02 <br>Para ter acesso aos dados, use os endpoints... ex: /api/produtos')
})

// middleware Obter a lista de produtos - RETRIEVE
app.get('/api/produtos', (req, res, next) => {
    res.json(lista_produtos)
})

// middleware Obter um produto específico - RETRIEVE
app.get('/api/produtos/:id', (req, res, next) => {
    let id = parseInt(req.params.id)
    let idx = lista_produtos.produtos.findIndex(elem => elem.id === id)
    if(idx != -1)
        res.status(200).json(lista_produtos.produtos[idx])
    else
        res.status(404).json({ message: 'Produto não encontrado!' })
})

// middleware Incluir um produto (Post) - CREATE
app.post('/api/produtos', (req, res, next) => {
    /*
    {
        "id": "",
        "descricao" : "feijão",
        "valor" : "10.00",
        "marca" : "Kicaldo"
    }
    ou
    {
        "descricao" : "feijão",
        "valor" : "10.00",
        "marca" : "Kicaldo"
    }
    */
    // id criado automaticamente, ao dar o post pode passar vazio ou não passar
    let idx = lista_produtos.produtos[lista_produtos.produtos.length-1].id + 1
    const produto = {
        id: idx,
        descricao: req.body.descricao,
        valor: req.body.valor,
        marca: req.body.marca
    }    
    // nessa API foi definido que nenhum campo pode ser nulo
    if(!produto.descricao || !produto.valor || !produto.marca )
        res.status(400).json({ message: 'descrição, valor e marca não podem ser vazios!' })
    else {
        lista_produtos.produtos.push(produto)
        res.status(201).json({ message: 'Produto inserido com sucesso!' })
    }
})

// middleware Alterar um produto (Put) - UPDATE
app.put('/api/produtos/:id', (req, res, next) => {
    let id = parseInt(req.params.id)
    const prod = lista_produtos.produtos.find(elem => elem.id === id)
    if(!prod)
        res.status(404).json({ message: 'Produto não encontrado!' })
    else {
        prod.descricao = req.body.descricao,
        prod.valor = req.body.valor,
        prod.marca = req.body.marca
        res.status(200).json({ message: 'Produto alterado com sucesso!' })
    }
        
})

// middleware Excluir um produto (Delete) - DELETE
app.delete('/api/produtos/:id', (req, res, next) => {
    let id = parseInt(req.params.id)
    let idx = lista_produtos.produtos.findIndex(elem => elem.id === id)
    if(idx != -1) {
        lista_produtos.produtos.splice(idx, 1)
        res.status(200).json({ message: 'Produto removido com sucesso!' })
    }
    else
        res.status(404).json({ message: 'Produto não encontrado!' }) 
})

const PORTA = process.env.PORT || 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
}) 