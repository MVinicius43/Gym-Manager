const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')

const server = express()

server.use(express.urlencoded({ extended: true })) // responsável por dar funcionalidade ao "req.body" em routes.js
server.use(express.static('public')) //express observa a pasta public para servir ao servidor os arquivos estáticos (arquivos de estilização)
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")
nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, () => {
    console.log('server is running')
})