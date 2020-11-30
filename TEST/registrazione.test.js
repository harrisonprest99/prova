const mongoose = require('mongoose');
const request = require('supertest');
const Utente = require('../MODELS/utente');
const app = require('../app');

describe("/utenti/signup", () => {

    let connection;

    beforeAll(async(done) => {
        connection = await mongoose.connect(process.env.DB_URL, 
        { useUnifiedTopology: true , useNewUrlParser: true})
        done();
    });

    afterAll(async(done) => {
        await mongoose.connection.close();
        done();
    });

    test('POST /signup senza email', async(done) => {
        const res = await request(app).post('/utenti/signup').send({
            username: 'prova',
            password: 'prova'
        });
        expect(res.statusCode && res.text).toBe(500 && '{"error":"L\'email inserita non è valida"}');
        done();  
    });

    test('POST /signup senza username', async(done) => {
        const res = await request(app).post('/utenti/signup').send({
            email: 'prova@prova.it',
            password: 'prova'
        });
        expect(res.statusCode && res.text).toBe(500 && '{"error":"Errore nella creazione dell\'utente"}');
        done();  
    });

    test('POST /signup senza password', async(done) => {
        const res = await request(app).post('/utenti/signup').send({
            email: 'prova@prova.it',
            username: 'prova'
        });
        expect(res.statusCode && res.text).toBe(400 && '{"error":"Password obbligatoria"}');
        done();  
    });

    test('POST /signup con email già presente', async(done) => {
        const res = await request(app).post('/utenti/signup').send({
            email: 'admin@admin.it',
            username: 'prova',
            password: 'prova'
        });
        expect(res.statusCode && res.text).toBe(409 && '{"error":"Email appartiene già ad un altro account"}');
        done();  
    });

    test('POST /signup con email già presente', async(done) => {
        const res = await request(app).post('/utenti/signup').send({
            email: 'adminadmin.it',
            username: 'prova',
            password: 'prova'
        });
        expect(res.statusCode).toBe(400);
        done();  
    });

});