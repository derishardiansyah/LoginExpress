import { teams } from '../database/db.js';

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
      if (data.name !== data.name) {
        const newTeams = await teams.create(data);
        if (newTeams) {
          res.json({
            status: 'success',
            statusCode: 200,
            message: 'Success add team',
            data: newTeams,
          });
        }
      } else {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Team is available',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err,
      });
    }
  },
  getTeam: async (req, res) => {
    try {
      const team = await teams.findAll();
      res.json({
        status: 'success',
        statusCode: 200,
        message: 'Success get all teams',
        data: team,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err,
      });
    }
  },
  getTeamById: async (req, res) => {
    try {
      const findTeam = await teams.findByPk(req.params.id);
      if (findTeam) {
        res.json({
          status: 'success',
          statusCode: 200,
          message: 'Success get team by id',
          data: findTeam,
        });
      } else {
        res.json({
          status: 'Error',
          statusCode: 400,
          message: 'team not found',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error test',
        statusCode: 500,
        message: err,
      });
    }
  },
  updateTeam: async (req, res) => {
    try {
      const updateTeam = await teams.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      const newTeam = {
        name: req.body.name,
        city: req.body.city,
        year: req.body.year,
        stadium: req.body.stadium,
        photo: `http://localhost:1900/${req.file.filename}`,
      };

      if (updateTeam[0] === 0) {
        res.json({
          status: 'error',
          statusCode: 400,
          message: 'Team not found',
        });
      } else {
        res.json({
          status: 'success',
          statusCode: 200,
          message: 'Success update team',
          data: newTeam,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err,
      });
    }
  },
  deleteTeam: async (req, res) => {
    try {
      const deleteTeam = await teams.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deleteTeam === 0) {
        res.json({
          status: 'error',
          statusCode: 400,
          message: 'Team not found',
        });
      } else {
        res.json({
          status: 'success',
          statusCode: 200,
          message: 'Success delete team',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err,
      });
    }
  },
};

export default teamsController;
