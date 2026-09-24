import Fastify from 'fastify'
import { Pool } from 'pg'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import jwt from '@fastify/jwt'
import bcrypt from 'bcrypt'
dotenv.config()

const sql = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: "localhost",
    port: 5432,
    database: process.env.DB_DATABASE
})

const servidor = Fastify();

servidor.register(cors, {
    origin: '*',
    methods: ['PUT', 'POST', 'DELETE', 'GET']
});

servidor.register(jwt, {
    secret: process.env.jwt,
    sign: {expiredIn: '1h'} 
})

servidor.post('/login', async (request, reply) => {
    const body = request.body;
    if (!body || !body.email || !body.senha) {
        reply.status(400).send({error: "email e senha obrigatórios!"})
    }
    const resultado = await sql.query('select * from Cliente where email = $1 AND senha = $2', [body.email, body.senha])    

    if (resultado.rows.length === 0) {
        reply.status(401).send({message: "E-mail ou senha inválidos!", login: false})
    } else if (resultado.rows.length === 1) {
        reply.status(200).send({message: "cliente logado", login: true})
    }

})

servidor.get('/clientes', async () => {
    const resultado = await sql.query('select * from Cliente')
    return resultado.rows
})

servidor.post('/clientes', async (request, reply) => {
    const body = request.body;

    if (!body || !body.nome || !body.email || !body.senha || !body.cpf) {
        return reply.status(400).send({
            message:"nome, email, senha e cpf são obrigatórios!"
        })
    }

    const salt = 10
    const senhaHash = await bcrypt.hash(body.senha, [salt])

    const resultado = await sql.query('INSERT INTO Cliente (nome, email, senha, cpf) VALUES ($1, $2, $3, $4)', [body.nome, body.email, body.senhaHash, body.cpf])          
    reply.status(201).send({message: 'Cliente Criado!'})
})

servidor.put('/clientes/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.nome || !body.email || !body.senha || !body.cpf) {
        return reply.status(400).send({
            message: "nome, email, senha e cpf são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const cliente = await sql.query('select * from cliente where id = $1', [id])  
    if (cliente.rows.length === 0) {
        return reply.status(400).send({
            message: "Cliente não existe!"
        })
    }

    const resultado = await sql.query('UPDATE cliente SET nome = $1, senha = $2, email = $3, cpf = $4 WHERE id = $5', [body.nome, body.email, body.senha, body.cpf, id])      
    reply.status(201).send({message: `cliente ${body.nome} alterado!`})          
})

servidor.delete('/clientes/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM cliente where id = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Cliente Deletado!'})
})

// Fim de usuário
// Início do dentista

servidor.post('/login', async (request, reply) => {
    const body = request.body;
    if (!body || !body.email || !body.senha) {
        reply.status(400).send({error: "email e senha obrigatórios!"})
    }
    const resultado = await sql.query('select * from Cliente where email = $1 AND senha = $2', [body.email, body.senha])    

    if (resultado.rows.length === 0) {
        reply.status(401).send({message: "E-mail ou senha inválidos!", login: false})
    } else if (resultado.rows.length === 1) {
        reply.status(200).send({message: "cliente logado", login: true})
    }

})

servidor.get('/clientes', async () => {
    const resultado = await sql.query('select * from Cliente')
    return resultado.rows
})

servidor.post('/clientes', async (request, reply) => {
    const body = request.body;

    if (!body || !body.nome || !body.email || !body.senha || !body.cpf) {
        return reply.status(400).send({
            message:"nome, email, senha e cpf são obrigatórios!"
        })
    }

    const salt = 10
    const senhaHash = await bcrypt.hash(body.senha, [salt])

    const resultado = await sql.query('INSERT INTO Cliente (nome, email, senha, cpf) VALUES ($1, $2, $3, $4)', [body.nome, body.email, body.senhaHash, body.cpf])          
    reply.status(201).send({message: 'Cliente Criado!'})
})

servidor.put('/clientes/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.nome || !body.email || !body.senha || !body.cpf) {
        return reply.status(400).send({
            message: "nome, email, senha e cpf são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const cliente = await sql.query('select * from cliente where id = $1', [id])  
    if (cliente.rows.length === 0) {
        return reply.status(400).send({
            message: "Cliente não existe!"
        })
    }

    const resultado = await sql.query('UPDATE cliente SET nome = $1, senha = $2, email = $3, cpf = $4 WHERE id = $5', [body.nome, body.email, body.senha, body.cpf, id])      
    reply.status(201).send({message: `cliente ${body.nome} alterado!`})          
})

servidor.delete('/clientes/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM cliente where id = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Cliente Deletado!'})
})


servidor.listen({   
    port: 3000
})