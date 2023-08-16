import { Sequelize } from 'sequelize';
import dbConfig from '../config/dbConfig.js';
import galeryModels from '../models/galeryModels.js';

const db = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, dbConfig.options);

export const galery = galeryModels(db);

export default db;
