import express from 'express';
import HomeController from '../controllers/homeController.js';

const homeRouter = express.Router();

homeRouter.get('/home', HomeController.getHome);
homeRouter.get('/pageUser', HomeController.pageUser);
homeRouter.get('/pageAdmin', HomeController.pageAdmin);

export default homeRouter;
