import { user } from '../database/db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const userController = {
  addUser: async (req, res) => {
    try {
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
      };
      const newUser = await user.create(data);

      const existingUser = await user.findOne({ where: { email: req.body.email } });
      const token = jwt.sign({ email: req.body.email }, process.env.secretVerify, { expiresIn: '1h' });
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'derishardiansyahh@gmail.com',
          pass: process.env.DB_PASSWORDTRANSPORTTER,
        },
      });
      const templateEmail = fs.readFileSync('./template/verify.html', 'utf8');
      const tempCompile = Handlebars.compile(templateEmail);
      const tempResult = tempCompile({
        email: data.email,
        link: `http://localhost:3000/auth/verify/${token}`,
      });
      const mailOptions = {
        from: 'derishardiansyah27@gmail.com',
        to: existingUser.email,
        subject: 'Verify Account',
        html: tempResult,
      };
      await transporter.sendMail(mailOptions);
      res.json({
        status: 'success',
        statusCode: 200,
        message: 'Success add user',
        data: {
          data: newUser,
          message: 'Verify account email sent',
        },
      });
    } catch (err) {
      const typeError = err?.errors?.[0]?.type;
      if (typeError === 'unique violation') {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'User with this email already exists',
        });
      }
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err,
      });
    }
  },
  verify: async (req, res) => {
    try {
      const { token } = req.params;
      const verifyToken = jwt.verify(token, process.env.secretVerify);
      await user.update(
        {
          // nama table di database
          isVerify: true,
        },
        { where: { email: verifyToken.email } }
      );
      res.json({ message: 'Verify success' });
    } catch {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid token',
      });
    }
  },
  getUser: async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1];
      let decode = jwt.verify(token, process.env.secretLogin);
      console.log(decode);

      if (!decode.isAdmin) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'User is not admin.',
        });
      }
      const users = await user.findAll();
      if (!users) {
        res.status(400).json({
          message: 'No user found',
          status: 'error',
        });
      }
      return res.status(200).send(users);
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
      const token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.secretLogin);
      if (!decode.isAdmin) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'User is not admin.',
        });
      }
      const users = await user.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!users) {
        throw new Error('User not found');
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
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Username and password are required.',
        });
      }

      const users = await user.findOne({
        where: {
          username: username,
        },
      });

      if (!users) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'User not found.',
        });
      }

      const passwordIsValid = await bcrypt.compare(password, users.password);

      if (!passwordIsValid) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'Wrong username or password.',
        });
      }

      if (!users.isVerify) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'User is not verified.',
        });
      }

      const token = jwt.sign(
        {
          username: username,
          isAdmin: users.isAdmin,
        },
        process.env.secretLogin,
        {
          expiresIn: '10d',
        }
      );

      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Login successful.',
        data: {
          username: username,
          role: users.role,
          token: token,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error.',
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      const existingUser = await user.findOne({ username: username });

      if (!existingUser) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'User not found.',
        });
      }

      if (!existingUser.isVerify) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'User is not verified.',
        });
      }

      // Define the password comparison method directly on the model
      // Compare the provided plain text password with the stored hashed password
      // using the bcrypt.compare function. It returns a promise that resolves to true if
      // the passwords match, and false otherwise.
      existingUser.comparePassword = async function (providedPassword) {
        return bcrypt.compare(providedPassword, this.password);
      };

      const isMatch = await existingUser.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({
          status: 'error',
          statusCode: 401,
          message: 'Invalid old password.',
        });
      }

      // Update password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      existingUser.password = hashedNewPassword; // Update the user's password field
      await existingUser.save();

      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Password updated successfully.',
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err.message,
      });
    }
  },
};

export default userController;
