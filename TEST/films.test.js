const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");

describe("POST / ", () => {
    test('POST with no body', () => {
        return request(app)
            .post('/films')
            //.set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(500, { error: 'Operazione fallita' });
    });
});

describe("GET / ", () => {

    let connection;

    beforeAll( async () => {
      jest.setTimeout(8000);
      jest.unmock('mongoose');
      connection = await  mongoose.connect("mongodb+srv://ADMIN:MJM9qhqIcXUbdCHd@test.dgbif.mongodb.net/Cinema?retryWrites=true&w=majority",
        {useNewUrlParser: true, useUnifiedTopology: true});
      console.log('Database connected!');
    });
  
    afterAll( () => {
      mongoose.connection.close(true);
      console.log("Database connection closed");
    });

    test('GET should return an array of films', async () => {
        return request(app)
            .get('/films')
            .expect('Content-Type', /json/)
            .expect(200)
            .then( (res) => {
                expect(res.body).not.toBeNull();
            }
        );
    });
});