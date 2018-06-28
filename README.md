# Serviço de Localização

Serviço desenvolvido no treinamento do módulo de microserviços da Compasso

## Requisitos

Instalar o **express**

```bash
npm install express --save
```

Instalar o **file-system**

```bash
npm install file-system --save
```

Instalar o **request**

```bash
npm install request --save
```

Fazer o clone e rodar os comandos abaixo

```bash
npm install 
npm start
```

## Testes

Para testar os serviços basta dar o start do serivdor `npm start`

## Serviço de listagem de endereços via cep

Para utilizar esse serviço você desse usar `/address`
ex: url/address

## Serviço de busca/listagem de um endereço usando um cep específico

Para utilizar esse serviço você desse usar `/address/numerodocep`
ex: url/address/67419

## Serviço de atualização do percentual do frete de um cep específico

Para utilizar esse serviço você deve estar autenticado e depois usar
`/adress/numerodocep/novopercentualfrete`
ex: url/address/67419/25

## Serviço de calculo do frete utilizando o cep informado com base no valor do seu pedido

Para utilizar esse serviço você deve estar autenticado e depois usar
`/freight/numerodocep/valordopedido`
ex: url/address/67419/1250




