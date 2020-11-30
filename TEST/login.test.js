const mongoose = require('mongoose');
const request = require('supertest');
const Utente = require('../MODELS/utente');
const app = require('../app');

describe("/utenti/login", () => {

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

    test('POST /login senza body', async(done) => {
        const res = await request(app).post('/utenti/login').send({});
        expect(res.statusCode && res.text).toBe(401 && '{"error":"Autorizzazione fallita, email o password errati"}');
        done();  
    });

    test('POST /login senza email', async(done) => {
        const res = await request(app).post('/utenti/login').send({
            password: 'admin'
        });
        expect(res.statusCode && res.text).toBe(401 && '{"error":"Autorizzazione fallita, email o password errati"}');
        done();  
    });

    test('POST /login senza password', async(done) => {
        const res = await request(app).post('/utenti/login').send({
            email: 'admin@admin.it'
        });
        expect(res.statusCode && res.text).toBe(401 && '{"error":"Autorizzazione fallita, email o password errati"}');
        done();  
    });

    test('POST /login email errata', async(done) => {
        const res = await request(app).post('/utenti/login').send({
            email: 'prova@admin.it',
            password: 'admin'
        });
        expect(res.statusCode && res.text).toBe(401 && '{"error":"Autorizzazione fallita, email o password errati"}');
        done();  
    });

    test('POST /login password errata', async(done) => {
        const res = await request(app).post('/utenti/login').send({
            email: 'admin@admin.it',
            password: 'prova'
        });
        expect(res.statusCode && res.text).toBe(401 && '{"error":"Autorizzazione fallita, email o password errati"}');
        done();  
    });

});