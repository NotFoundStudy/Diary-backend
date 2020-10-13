import { userSchema as userValidation } from '../validation/schema';
import { userSchema } from '../../db/model/users'; 
export async function register({ data }) {
	const response = {
		status: 300,
		error: false,
		message: '',
		data: {}
	};

	// validation check
	try {
		const value = await userValidation.validateAsync(data);
		const { email, studentId } = data;
		const exists = await userSchema.findExistancy({ email, studentId });

		if (exists) {
			response.error = true
			response.status = 409;
			const key = exists.email === email ? 'email' : 'displayName';
			response.message = `Already exists [${key}]`;
			return response;
		}
		const user = await userSchema.localRegister({
		  email, password, studentId, name
		});
		response.data = user
	} catch (err) {
		response.error = true;
		response.status= 409;
		response.message = err 
	}
	return response;
}