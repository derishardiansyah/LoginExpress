import { user } from '../database/db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import responseHelper from '../helper/responseHelper.js';

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
        from: 'derishardiansyahh@gmail.com',
        to: existingUser.email,
        subject: 'Verify Account',
        html: tempResult,
      };
      await transporter.sendMail(mailOptions);
      return responseHelper(
        res,
        200,
        {
          data: newUser,
          message: 'Verify account email sent',
        },
        'User has been created',
        'success'
      );
    } catch (err) {
      const typeError = err?.errors?.[0]?.type;
      if (typeError === 'unique violation') {
        return responseHelper(res, 400, '', 'User with this email already exists');
      }
      responseHelper(res, 500, '', err, 'error');
    }
  },
  verify: async (req, res) => {
    try {
      // didapat dari token addUser
      const { token } = req.params;
      const verifyToken = jwt.verify(token, process.env.secretVerify);

      console.log(verifyToken);
      await user.update(
        {
          // nama table di database
          isVerify: true,
        },
        { where: { email: verifyToken.email } }
      );
      return responseHelper(res, 200, '', 'Verify success', 'success');
    } catch (err) {
      console.log(err);
      responseHelper(res, 400, '', 'Verify failed', 'error');
    }
  },
  getUser: async (req, res) => {
    try {
      let token = req.headers.authorization.split(' ')[1];
      let decode = jwt.verify(token, process.env.secretLogin);

      if (!decode.isAdmin) {
        return responseHelper(res, 401, '', 'Unauthorized', 'error');
      }
      const users = await user.findAll();
      if (!users) {
        return responseHelper(res, 401, '', 'User not found', 'error');
      }
      return responseHelper(res, 200, users, 'success', 'data');
    } catch (err) {
      responseHelper(res, 500, '', err, 'error');
    }
  },
  deleteUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.secretLogin);
      if (!decode.isAdmin) {
        return responseHelper(res, 401, '', 'User is not admin', 'error');
      }
      const users = await user.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!users) {
        return responseHelper(res, 401, '', 'User not found', 'error');
      }
      const deletedUser = await users.destroy();
      if (deletedUser) {
        return responseHelper(res, 200, '', 'User deleted successfully', 'success');
      }
    } catch (err) {
      responseHelper(res, 500, '', err, 'error');
    }
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return responseHelper(res, 400, '', 'Username or Password is empty', 'error');
      }

      const users = await user.findOne({
        where: {
          username: username,
        },
      });

      if (!users) {
        return responseHelper(res, 401, '', 'Invalid Username', 'error');
      }

      const passwordIsValid = await bcrypt.compare(password, users.password);
      if (!passwordIsValid) {
        return responseHelper(res, 401, '', 'Invalid Password', 'error');
      }

      if (!users.isVerify) {
        return responseHelper(res, 401, '', 'Your account is not verified yet', 'error');
      }

      // supaya token hanya bisa digunakan by User
      const token = jwt.sign(
        {
          username: username,
          isAdmin: users.isAdmin,
          isVerify: users.isVerify,
        },
        process.env.secretLogin,
        {
          expiresIn: '1h',
        }
      );
      return responseHelper(
        res,
        200,
        {
          username: username,
          role: users.role,
          token: token,
        },
        'Login successful'
      );
    } catch (error) {
      responseHelper(res, 500, '', error, 'error');
    }
  },
  changePassword: async (req, res) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      const existingUser = await user.findOne({ where: { username: username } });

      if (!existingUser) {
        return responseHelper(res, 404, '', 'User not found');
      }

      if (!existingUser.isVerify) {
        return responseHelper(res, 401, '', 'Your account is not verified. Please verify your email to login');
      }

      existingUser.comparePassword = async function (providedPassword) {
        return bcrypt.compare(providedPassword, this.password);
      };

      const isMatch = await existingUser.comparePassword(oldPassword);
      if (!isMatch) {
        return responseHelper(res, 401, '', 'Old password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      existingUser.password = hashedNewPassword;
      await existingUser.save();

      return responseHelper(res, 200, '', 'Password changed successfully');
    } catch (err) {
      responseHelper(err, 500, '', err.message);
    }
  },
  getProfile: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.secretLogin);

      const requestedUsername = req.params.username;
      if (decode.username !== requestedUsername) {
        return responseHelper(res, 401, '', 'Unauthorized access to this profile');
      }
      const users = await user.findOne({
        where: {
          username: req.params.username,
        },
      });
      return responseHelper(res, 200, users, 'Success');
    } catch (err) {
      responseHelper(res, 500, '', err.message);
    }
  },
};

export default userController;
