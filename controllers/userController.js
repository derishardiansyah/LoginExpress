import { user } from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userController = {
  addUser: async (req, res) => {
    try {
      const existingUser = await user.findOne({ where: { email: req.body.email } });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Email already exists',
        });
      }
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
      };
      const newUser = await user.create(data);
      if (newUser) {
        res.json({
          status: 'success',
          statusCode: 200,
          message: 'Success add user',
          data: newUser,
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
  getUser: async (req, res) => {
    try {
      const users = await user.findAll();
      if (user) {
        res.json({
          status: 'success',
          statusCode: 200,
          message: 'Success get user',
          data: users,
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
  deleteUser: async (req, res) => {
    try {
      const users = await user.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!users) {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'User not found',
        });
      }
      const deletedUser = await users.destroy();
      if (deletedUser) {
        res.json({
          status: 'success',
          statusCode: 200,
          message: 'Success delete user',
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
  loginUser: async (req, res) => {
    try {
      if (req.body.username && req.body.password) {
        const users = await user.findOne({
          where: {
            username: req.body.username,
          },
        });

        if (users) {
          const passwordIsValid = bcrypt.compareSync(req.body.password, users.password);
          if (passwordIsValid) {
            const tampilData = {
              username: req.body.username,
              role: users.role,
            };
            if (users.role !== 'user') {
              const token =
                'bearer' +
                jwt.sign(
                  {
                    username: req.body.username,
                    role: req.body.role,
                  },
                  'secret',
                  {
                    expiresIn: '10d',
                  }
                );
              res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Success login',
                data: {
                  username: req.body.username,
                  role: users.role,
                  token: token,
                },
              });
            } else {
              res.json({
                status: 'success',
                statusCode: 200,
                message: 'Success login',
                data: tampilData,
              });
            }
          } else {
            res.status(401).json({
              status: 'error',
              statusCode: 401,
              message: 'Wrong username and password',
            });
          }
        } else {
          res.status(401).json({
            status: 'error',
            statusCode: 401,
            message: 'User not found',
          });
        }
      } else {
        res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Required username and password',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err,
      });
    }
  },
};

export default userController;
