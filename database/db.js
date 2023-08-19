import { Sequelize } from 'sequelize';
import dbConfig from '../config/dbConfig.js';
import teamsModels from '../models/teamsModels.js';
import userModels from '../models/userModels.js';

console.log(dbConfig);

const db = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, dbConfig.options);

export const teams = teamsModels(db);
export const user = userModels(db);

export default db;
