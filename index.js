var request = require("request");
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const data = require('./data.json')


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


app.get('/address', function (req, res) {
    // let data = data
    // var arr = data.map((teste) => {data.cep})
    let retorno=[]
    data.forEach(ende => {
        retorno.push({cep: ende.cep,
            rua: ende.street,
            cidade: ende.city,
            estado: ende.state
            
        })
    });
    res.status(200).json(retorno)
    
})

app.get('/address/:cep', function (req, res) {
    let teste = req.params.cep
    console.log(teste)
    //Por enquanto essa lógica não está funcionando!!!
    // let verdade = false

    // let retorno=[]
    // data.forEach(ende => {
    //     if(teste == ende.cep){
    //         retorno.push({cep: ende.cep,
    //             rua: ende.street,
    //             cidade: ende.city,
    //             estado: ende.state
                
    //         })
    //         res.status(200).json(retorno)
    //     }
    //     else{
    //         res.status(401).send("esse cep nao existe")
    //     }
    // });
    
    
    
})

app.post('/update',verifyToken,function (req,res) {
    let payload = req.payload
    if(payload){
        res.status(200).send("Feito o update")
    } else{
        res.status(401).send("Não autorizado")
    }
})

app.get('/', verifyToken, function (req, res) {
    let payload = req.payload
    if(payload){
        res.status(200).json({user:payload.uuid,dados:"Dados secretos do usuário "+payload.login})
    } else{
        res.set('WWW-Authenticate', 'Bearer realm="401"')
        res.status(401).json({ loged: false, message: "Voce precisa de um token para acessar esse serviço" })
    }
})


app.listen(port, function () {
    console.log("Rodando na porta:", port)
})