const app = require("../app");
const request = require("supertest");

describe("GET / ", () => {
    test('GET should return an array of sale', async () => {
        return request(app)
            .get('/sale')
            .expect('Content-Type', /json/)
            .expect(200)
            .then( (res) => {
                expect(res.body).not.toBeNull();
            }
        );
    });
});