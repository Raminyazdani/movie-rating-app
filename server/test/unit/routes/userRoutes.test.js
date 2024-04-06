const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const userController = require('../controllers/userController');

// Mocking the userController methods
jest.mock('../controllers/userController', () => ({
    checkUser: jest.fn(),
    createUser: jest.fn(),
    getUserId: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /user/checkUser/:email should call userController.checkUser', async () => {
        userController.checkUser.mockResolvedValueOnce({ exists: true });
        const response = await request(app).get('/user/checkUser/test@example.com');
        expect(userController.checkUser).toHaveBeenCalledWith({ params: { email: 'test@example.com' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ exists: true });
    });

    it('POST /user/createUser should call userController.createUser', async () => {
        userController.createUser.mockResolvedValueOnce({ userId: 123, message: 'User created successfully' });
        const response = await request(app).post('/user/createUser').send({ email: 'test@example.com' });
        expect(userController.createUser).toHaveBeenCalledWith({ body: { email: 'test@example.com' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ userId: 123, message: 'User created successfully' });
    });

    it('GET /user/getUserId/:email should call userController.getUserId', async () => {
        userController.getUserId.mockResolvedValueOnce([{ userId: 123, email: 'test@example.com' }]);
        const response = await request(app).get('/user/getUserId/test@example.com');
        expect(userController.getUserId).toHaveBeenCalledWith({ params: { email: 'test@example.com' } }, expect.any(Object));
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ userId: 123, email: 'test@example.com' }]);
    });
});
