const express = require('express');
const userController  = require('../controllers/userController');
const { createUserSchema, userIdSchema, updateUserSchema} = require('../utils/schemas/user');
const validationHandlers = require('../utils/middlewares/validationHandlers');

function userApi(app) { 
    const router = new express.Router();
    app.use('/api/users', router)

    router.get('/', userController.getUsers);
    router.get('/profile/:id', validationHandlers({ id: userIdSchema }, 'params'), userController.getUser);
    router.post('/login', userController.signIn);
    router.post('/', validationHandlers(createUserSchema), userController.createUser);
    router.put('/:id', validationHandlers({ id: userIdSchema }, 'params'), validationHandlers(updateUserSchema), userController.updateUser);
    router.delete('/:id', validationHandlers({ id: userIdSchema }, 'params'), userController.deleteUser)
 }

module.exports = userApi;
 