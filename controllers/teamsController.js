import { teams } from '../database/db.js';
import responHelper from '../helper/responseHelper.js';
import { Redis } from 'ioredis';

const redis = new Redis();
const teamsController = {
  addTeam: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        city: req.body.city,
        year: req.body.year,
        stadium: req.body.stadium,
        photo: `http://localhost:3000/${req.file.filename}`,
      };
      const existingTeam = await teams.findOne({ where: { name: data.name } });
      if (!existingTeam) {
        const newTeams = await teams.create(data);
        if (!newTeams) {
          return responHelper(res, 400, '', 'Team is available');
        }
        return responHelper(res, 201, newTeams, 'Team added successfully');
      }
    } catch (err) {
      responHelper(res, 500, '', 'Error adding team', 'error');
    }
  },
  getTeam: async (req, res) => {
    try {
      const cacheData = await redis.get('team');
      if (cacheData) {
        return responHelper(res, 200, JSON.parse(cacheData), 'Team list', 'success');
      }
      const team = await teams.findAll();
      await redis.set('team', JSON.stringify(team));
      return responHelper(res, 200, team, 'Team list', 'success');
    } catch (err) {
      console.log(err);
      responHelper(res, 500, '', err.message, 'Error get team');
    }
  },
  getTeamById: async (req, res) => {
    try {
      const cacheData = await redis.get('teambyID');
      if (cacheData) {
        console.log('lewat redis');
        return responHelper(res, 200, JSON.parse(cacheData), 'Team list', 'success');
      }
      const findTeam = await teams.findByPk(req.params.id);
      console.log('lewatdb');
      await redis.set('teambyID', JSON.stringify(findTeam));
      if (!findTeam) {
        return responHelper(res, 400, '', 'team not found');
      }
      return responHelper(res, 200, findTeam, 'Team list', 'success');
    } catch (err) {
      responHelper(res, 500, '', err.message, 'Error get team');
    }
  },
  updateTeam: async (req, res) => {
    try {
      const updateTeam = await teams.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      if (!updateTeam) {
        return responHelper(res, 400, '', 'team not found');
      }
      const newTeam = {
        name: req.body.name,
        city: req.body.city,
        year: req.body.year,
        stadium: req.body.stadium,
        photo: `http://localhost:3000/${req.file.filename}`,
      };

      return responHelper(res, 200, newTeam, 'Team updated', 'success');
    } catch (err) {
      responHelper(res, 500, '', err.message, 'Error update team');
    }
  },
  deleteTeam: async (req, res) => {
    try {
      const deleteTeam = await teams.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!deleteTeam) {
        return responHelper(res, 400, '', 'team not found');
      }
      return responHelper(res, 200, '', 'Team deleted', 'success');
    } catch (err) {
      responHelper(res, 500, '', err.message, 'Error delete team');
    }
  },
};

export default teamsController;
