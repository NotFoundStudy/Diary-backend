import { userSchema as userValidation } from '../validation/schema';
import User from '../../db/model/users';

export async function register({ data }) {
	const response = {
		status: 300,
		error: false,
		message: '',
		data: {},
	};

	// validation check
	try {
		const value = await userValidation.validateAsync(data);
		const { email, studentId, password, name } = data;
		const exists = await User.findExistancy({ email, studentId });

		if (exists) {
			response.error = true;
			response.status = 409;
			const key = exists.email === email ? 'email' : 'displayName';
			response.message = `Already exists [${key}]`;
			return response;
		}
		const user = await User.localRegister({
			email,
			password,
			studentId,
			name,
		});
		response.data = user;
	} catch (err) {
		response.error = true;
		response.status = 409;
		response.message = err;
		console.log('ERROR [AUTH]:::', err);
	}
	return response;
}