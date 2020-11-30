const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Recensioni = require('../MODELS/recensione');
const app = require('../app');

describe("Test /recensioni", () => {

    let connection;

    var token = jwt.sign(
        {email: 'admin@admin.it'},
        process.env.JWT_KEY,
        {expiresIn: 86400}
    );

    beforeAll(async(done) => {
        connection = await mongoose.connect(process.env.DB_URL, 
        { useUnifiedTopology: true , useNewUrlParser: true})
        done();
    });

    afterAll(async(done) => {
        await mongoose.connection.close();
        done();
    });

    test('POST /recensioni senza informazioni', async(done) => {
        const res = await request(app)
        .post('/recensioni')
        .set('Authorization', 'Bearer ' + token)
        .send({
            utenteId: '5fc0ba684543fd17dce05f36',
            filmId: '5fb8ed56f38df832848c1f55',
        });
        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('{"error":"Operazione fallita"}');
        done();  
    });

    test('POST /recensioni senza titolo', async(done) => {
        const res = await request(app)
        .post('/recensioni')
        .set('Authorization', 'Bearer ' + token)
        .send({
            utenteId: '5fc0ba684543fd17dce05f36',
            filmId: '5fb8ed56f38df832848c1f55',
            valutazione: 3,
            commento: 'prova'
        });
        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('{"error":"Operazione fallita"}');
        done();  
    });

    test('POST /recensioni senza commento', async(done) => {
        const res = await request(app)
        .post('/recensioni')
        .set('Authorization', 'Bearer ' + token)
        .send({
            utenteId: '5fc0ba684543fd17dce05f36',
            filmId: '5fb8ed56f38df832848c1f55',
            titolo: 'prova',
            valutazione: 3,
        });
        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('{"error":"Operazione fallita"}');
        done();  
    });

    test('POST /recensioni senza valutazione', async(done) => {
        const res = await request(app)
        .post('/recensioni')
        .set('Authorization', 'Bearer ' + token)
        .send({
            utenteId: '5fc0ba684543fd17dce05f36',
            filmId: '5fb8ed56f38df832848c1f55',
            titolo: 'prova',
            commento: 'prova'
        });
        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('{"error":"Operazione fallita"}');
        done();  
    });

});