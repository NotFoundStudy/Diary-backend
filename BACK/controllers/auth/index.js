import { register as registerService } from '@services/auth';
import winston from '@config/winston';

export function register(req, res) {
	const { body } = req;
	registerService({data: body}).then(response => {
		if(response.error) {
			res.status = response.status;
			res.send(response.message)
			return
		}
		res.send(response.data)
	}).catch(err => {
		winston.error(`Register Failed... ::: ${err.message}`)
	})
}