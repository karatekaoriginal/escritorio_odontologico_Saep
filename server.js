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
    sign: {expiresIn: '1h'} 
})


servidor.get('/clientes', async () => {
    const resultado = await sql.query('select * from Cliente ORDER BY nome ASC')
    return resultado.rows
})

servidor.post('/clientes', async (request, reply) => {
    const body = request.body;
    
    if (!body || !body.nome || !body.email || !body.cpf) {
        return reply.status(400).send({
            message:"nome, email e cpf são obrigatórios!"
        })
    }
    
    const salt = 10
    
    const cpfHash = await bcrypt.hash(body.cpf, salt)
    
    const resultado = await sql.query('INSERT INTO Cliente (nome, email, cpf) VALUES ($1, $2, $3)', [body.nome, body.email, cpfHash])          
    reply.status(201).send({message: 'Cliente Criado!'})
})

servidor.put('/clientes/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    
    if (!body || !body.nome || !body.email || !body.cpf) {
        return reply.status(400).send({
            message: "nome, email e cpf são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }
    
    const cliente = await sql.query('select * from Cliente where id_cliente = $1', [id])  
    if (cliente.rows.length === 0) {
        return reply.status(400).send({
            message: "Cliente não existe!"
        })
    }
    
    
    const salt = 10
    
    const cpfHash = await bcrypt.hash(body.cpf, salt)
    
    const resultado = await sql.query('UPDATE cliente SET nome = $1, email = $2, cpf = $3 WHERE id_cliente = $4', [body.nome, body.email, cpfHash, id])      
    reply.status(201).send({message: `cliente ${body.nome} alterado!`})          
})

servidor.delete('/clientes/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM cliente where id_cliente = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Cliente Deletado!'})
})

// Fim de usuário

// Início do dentista



servidor.get('/dentistas', async () => {
    const resultado = await sql.query('select * from Dentista ORDER BY nome ASC')
    return resultado.rows
})

servidor.post('/dentistas', async (request, reply) => {
    const body = request.body;
    
    if (!body || !body.nome || !body.email || !body.cpf) {
        return reply.status(400).send({
            message:"nome, email e cpf são obrigatórios!"
        })
    }
    
    const salt = 10
    const cpfHash = await bcrypt.hash(body.cpf, salt)
    
    const resultado = await sql.query('INSERT INTO Dentista (nome, email, cpf) VALUES ($1, $2, $3)', [body.nome, body.email, cpfHash])          
    reply.status(201).send({message: 'Dentista Criado!'})
})

servidor.put('/dentistas/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    
    if (!body || !body.nome || !body.email || !body.cpf) {
        return reply.status(400).send({
            message: "Nome, email e cpf são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }
    
    const cliente = await sql.query('select * from Dentista where id_dentista = $1', [id])  
    if (cliente.rows.length === 0) {
        return reply.status(400).send({
            message: "Dentista não existe!"
        })
    }
    
    
    const salt = 10
    
    const cpfHash = await bcrypt.hash(body.cpf, salt)
    
    const resultado = await sql.query('UPDATE Dentista SET nome = $1, email = $2, cpf = $3 WHERE id_dentista = $4', [body.nome, body.email, cpfHash, id])      
    reply.status(201).send({message: `Dentista ${body.nome} alterado!`})          
})

servidor.delete('/dentistas/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM Dentista where id_dentista = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Dentista Deletado!'})
})

// Fim do código para os dentistas

// Início do código para os usuários do sistema

servidor.post('/login', async (request, reply) => {
    const body = request.body;
    if (!body || !body.email || !body.senha) {
        reply.status(400).send({error: "email e senha obrigatório!"})
    }
    const resultado = await sql.query('select * from Usuario where email = $1 AND senha = $2', [body.email, body.senha])    

    if (resultado.rows.length === 0) {
        reply.status(401).send({message: "E-mail e senha inválidos!", login: false})
    } else if (resultado.rows.length === 1) {
        reply.status(200).send({message: "Usuário logado", login: true})
    }
})

servidor.get('/usuarios', async () => {
    const resultado = await sql.query('select * from Usuario ORDER BY nome ASC')
    return resultado.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const body = request.body;
    
    if (!body || !body.nome || !body.email || !body.senha || !body.cpf) {
        return reply.status(400).send({
            message:"nome, email e cpf são obrigatórios!"
        })
    }
    
    const salt = 10
    const cpfHash = await bcrypt.hash(body.cpf, salt)
    
    const resultado = await sql.query('INSERT INTO Usuario (nome, email, senha, cpf) VALUES ($1, $2, $3, $4)', [body.nome, body.email, body.senha, cpfHash])          
    reply.status(201).send({message: 'Dentista Criado!'})
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    
    if (!body || !body.nome || !body.email || !body.senha || !body.cpf) {
        return reply.status(400).send({
            message: "Todos os dados são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }
    
    const cliente = await sql.query('select * from Usuario where id_usuario = $1', [id])  
    if (cliente.rows.length === 0) {
        return reply.status(400).send({
            message: "Usuário não existe!"
        })
    }
    
    
    const salt = 10
    
    const cpfHash = await bcrypt.hash(body.cpf, salt)
    
    const resultado = await sql.query('UPDATE Usuario SET nome = $1, email = $2, senha = $3 , cpf = $4 WHERE id_usuario = $5', [body.nome, body.email, body.senha, cpfHash, id])      
    reply.status(201).send({message: `Usuário ${body.nome} alterado!`})          
})

servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM Usuario where id_usuario = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Usuário Deletado!'})
})

// Fim do código para os usuários

// Início do código para os agendamentos

servidor.post('/agendamentos', async (request, reply) => {
    const body = request.body;

    if (!body || !body.titulo || !body.descricao || !body.data_consulta) {
        return reply.status(400).send({
            message:"Informações faltando"
        })
    }

    const resultado = await sql.query('INSERT INTO Agendamento (descricao, descricao, data_consulta) VALUES ($1, $2)', [body.nome, body.lingprog])          
    return reply.status(201).send({message: 'Agendamento Marcado!'})
})

servidor.put('/agendamentos/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.titulo || !body.descricao || !body.data_consulta) {
        return reply.status(400).send({
            message: "Título, descrição e a data selecionada são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const agendamento = await sql.query('SELECT * from Agendamento where id_arquivo = $1', [id])  
    if (agendamento.rows.length === 0) {
        return reply.status(400).send({
            message: "Agendamento não existe!"
        })
    }

    const resultado = await sql.query('UPDATE Agendamento SET Nome = $1, LingProg = $2 WHERE id_arquivo = $3', [body.nome, body.lingprog, id])      
    return reply.status(200).send({message: `Agendamento: ${body.nome} alterado!`})          
})

servidor.delete('/agendamentos/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM Agendamento where id_arquivo = $1', [id]) 
    console.log(resultado);    
    return reply.status(200).send({message:'Agendamento deletado!'})
})

servidor.listen({   
    port: 3000
})