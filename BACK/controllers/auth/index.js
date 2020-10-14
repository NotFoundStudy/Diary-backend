import { register as registerService } from '../../services/auth';

export function register(req, res) {
	const { body } = req;
	registerService({data: body}).then(response => {
		console.log(">>>> response", response)
		if(response.error) {
			res.status = response.status;
			res.send(response.message)
			return
		}
		res.send(response.data)
	}).catch(err => {
		console.log(">>>>> error::: register")
	})
}