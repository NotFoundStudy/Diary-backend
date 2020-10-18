import mongoose from 'mongoose';
import dotenv from 'dotenv';
import winston from '@config/winston';

dotenv.config();

module.exports = function () {
	return {
		connect: mongoose
			.connect(process.env.MONGO_URI, { useNewUrlParser: true })
			.then(() => {
				winston.info(`⛳ mongodb is connected`);
			})
			.catch((err) => {
				winston.error(err.message);
			})
	};
};