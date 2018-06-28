var request = require("request");
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const data = require('./data.json')
const fs = require('fs');



function verifyToken(req, res, next) {
    let auth = req.headers.authorization
    if (auth) {
        auth = auth.split(' ')[1]
        let options = {
            method: 'POST',
            url: 'http://comp-ms-auth.herokuapp.com:80/api/verify',
            headers:
                { Authorization: 'Bearer ' + auth }
        }
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            body = JSON.parse(body)
            if (body.loged) {
                req.payload = body
            }
            next()
        })
    } else {
        next()
    }
}


app.get('/', function (req, res) {
    res.send("Hello")
})

//Lista todos os endereços
app.get('/address', function (req, res) {
    let retorno = []
    data.forEach(ende => {
        retorno.push({
            cep: ende.cep,
            rua: ende.street,
            cidade: ende.city,
            estado: ende.state

        })
    });
    res.status(200).json(retorno)

})

//Lista um cep específico
app.get('/address/:cep', function (req, res) {
    // verifica se existe o CEP no JSON
    let cepRetornado = req.params.cep !== undefined ? data.filter(function (obj) { return obj.cep == req.params.cep }) : undefined
    let cepFormatado = {}
    // atribui o cep retornado para o objeto 
    if (typeof cepRetornado != "undefined" && cepRetornado != null && cepRetornado.length != null && cepRetornado.length > 0) {
        cepFormatado = {
            cep: cepRetornado[0].cep,
            rua: cepRetornado[0].street,
            cidade: cepRetornado[0].city,
            estado: cepRetornado[0].state
        }
    } else {
        cepFormatado = { message: "O CEP informado não existe!" }
    }
    res.json(cepFormatado);
})

//Atualiza o percentual do frete
app.post('/address/:cep/:freight', verifyToken, function (req, res) {
    let payload = req.payload
    if (payload) {
        let cepRetornado = req.params.cep !== undefined ? data.filter(function (obj) { return obj.cep == req.params.cep }) : undefined
        let freightRetornado = req.params.freight

        let i = 0

        data.forEach(ende => {

            if (ende.cep == cepRetornado[0].cep) {
                return
            }

            i++
        })

        data[i].freight = freightRetornado

        fs.writeFile('./data.json', JSON.stringify(data))

        res.status(200).send("Feito o update")
    } else {
        res.status(401).send("Não autorizado")
    }
})

//recebe o cep e o valor do pedido
//retorna o valor do frete
//Calcula o valor do frete
app.get('/freight/:cep/:valorPedido', verifyToken, function (req, res, valorPedido) {
    let payload = req.payload
    if (payload) {
        let retorno
        let valorPedido = req.params.valorPedido
        // verifica se existe o CEP no JSON
        let cepRetornado = req.params.cep !== undefined ? data.filter(function (obj) { return obj.cep == req.params.cep }) : undefined
        let valorFrete = {}
        // atribui o cep retornado para o objeto 
        if (typeof cepRetornado != "undefined" && cepRetornado != null && cepRetornado.length != null && cepRetornado.length > 0) {
            valorFrete = {
                frete: cepRetornado[0].freight
            }
            retorno = "O valor do seu frete é: "+(valorPedido * valorFrete.frete)/100
            
        } else {
            retorno = "O CEP informado não existe!"
        }
        res.status(200).send(retorno)
    } else {
        res.status(401).send("Não autorizado")
    }
})

app.get('/', verifyToken, function (req, res) {
    let payload = req.payload
    if (payload) {
        res.status(200).json({ user: payload.uuid, dados: "Dados secretos do usuário " + payload.login })
    } else {
        res.set('WWW-Authenticate', 'Bearer realm="401"')
        res.status(401).json({ loged: false, message: "Voce precisa de um token para acessar esse serviço" })
    }
})


app.listen(port, function () {
    console.log("Rodando na porta:", port)
})