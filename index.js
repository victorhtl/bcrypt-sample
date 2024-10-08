import express from 'express'
import pg from 'pg'
import {Config} from './config.js'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'

const {Pool} = pg
const pool = new Pool(Config)
const app = express()

app.use(bodyParser.json())

app.post('/signup', async (req, res)=>{
    const client = await pool.connect()
    const user = req.body

    user.password = await bcrypt.hash(user.password, 10)

    const query = {
        text: 'INSERT INTO users(name, email, password, admin) VALUES($1, $2, $3, $4) RETURNING id',
        values: [user.name, user.email, user.password, user.admin]
    }

    try {
        const query_res = await client.query(query)
        res.status(200).send(query_res.rows)
    } catch(msg){
        res.sendStatus(500)
    } finally {
        await client.release()
    }
})

app.post('/signin', async (req, res)=>{
    const client = await pool.connect()

    const query = {
        text: 'SELECT email, password FROM users WHERE email=$1',
        values: [req.body.email]
    }

    try {
        const user = await client.query(query)

        if(!user) return res.status(400).send('User not exists') 
        
        const isMatch = await bcrypt.compare(req.body.password, user.rows[0].password)
        
        isMatch ? 
            res.status(200).send('Authorized') : 
            res.status(401).send('Not Authorized')

    } catch(msg){
        res.sendStatus(500)
    } finally {
        await client.release()
    }  
})

app.listen(3000)