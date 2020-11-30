const request = require('supertest');
const app = require('../app');

describe('Testing app.js', () => {

    test('app module should be defined', (done) => {
        expect(app).toBeDefined();
        done();
    });

    test('GET / should return 200', async(done) => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        done();
    });
    
});