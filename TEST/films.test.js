const mongoose = require('mongoose');
const request = require('supertest');
const Film = require('../MODELS/film');
const app = require('../app');

describe("/films", () => {

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

    test('GET /film/:titolo', async(done) => {
        const res = await request(app).get('/films/prova');
        expect(res.statusCode && res.text).toBe(404 && '{"error":"Film non trovato"}');
        done();
    })

    test('POST /films senza body', async(done) => {
        const res = await request(app).post('/films').send({});
        expect(res.statusCode && res.text).toBe(500 && '{"error":"Operazione fallita"}');
        done();  
    });

    test('POST /films senza titolo', async(done) => {
        const res = await request(app).post('/films').send({
            anno: 2006, 
            durata: 100
        });
        expect(res.statusCode && res.text).toBe(500 && '{"error":"Operazione fallita"}');
        done();  
    });

    test('POST /films senza anno', async(done) => {
        const res = await request(app).post('/films').send({
            titolo: 'prova',
            durata: 100
        });
        expect(res.statusCode && res.text).toBe(500 && '{"error":"Operazione fallita"}');
        done();  
    });
    
    test('POST /films senza durata', async(done) => {
        const res = await request(app).post('/films').send({
            titolo: 'prova', 
            anno: 2006
        });
        expect(res.statusCode && res.text).toBe(500 && '{"error":"Operazione fallita"}');
        done();  
    });

});