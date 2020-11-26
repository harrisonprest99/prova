const app = require("../app");
const request = require("supertest");

describe("GET / ", () => {
    test('GET should return an array of infofilms', async () => {
        return request(app)
            .get('/infofilms')
            .expect('Content-Type', /json/)
            .expect(200)
            .then( (res) => {
                expect(res.body).not.toBeNull();
            }
        );
    });
});