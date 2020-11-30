const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Prenotazioni = require('../MODELS/prenotatione');
const app = require('../app');

describe("Test /prenotazioni", () => {

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

    test('POST /prenotazioni senza body', async(done) => {
        const res = await request(app)
        .post('/prenotazioni')
        .set('Authorization', 'Bearer ' + token)
        .send({});
        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('{"error":"Impossibile creare prenotazioni su informazioni inesistenti"}');
        done();  
    });

});