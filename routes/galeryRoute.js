import express from 'express';
import galeryController from '../controllers/galeryController.js';
import upload from '../helper/multiHelper.js';

const galeryRouter = express.Router();

// galeryRouter.get('/', galeryController.getTeam);
// galeryRouter.get('/:id', galeryRouter.getTeamById);
galeryRouter.post('/', upload.single('photo_url'), galeryController.addGalery);
galeryRouter.get('/', galeryController.getGalery);
// galeryRouter.put('/:id', galeryRouter.updateTeam);
// galeryRouter.delete('/:id', galeryRouter.deleteTeam);

export default galeryRouter;
