import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', userController.addUser);
userRouter.get('/register', userController.getUser);
userRouter.delete('/register/:id', userController.deleteUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/verify/:token', userController.verify);
userRouter.put('/changepassword/:name', userController.changePassword);
userRouter.get('/profile/:username', userController.getProfile);
export default userRouter;
