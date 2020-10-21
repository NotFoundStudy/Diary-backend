import { userSchema as userValidation } from '../validation/schema';
import User from '@db/model/users';

export async function register({ data }) {
	const response = {
		status: 300,
		error: '',
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
			const key = exists.email === email ? 'email' : 'studentId';
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
		response.error = '0002';
		response.status = 409;
		response.message = 'Server error';
		winston.error(`Register Failed... ::: ${err.message}`);
	}
	return response;
}

export async function confirmationSave({ email, confirmation_code }) {
	const response = {
		status: 300,
		error: '',
		message: '',
		data: {},
	};
	try {
		const userData = await User.findByEmail(email);
		if (userData.confirmation_code === confirmation_code) {
			userData.updateField('confirmed', true);
			response.data = userData;
		} else {
			response.error = '1003'
			response.message = 'confirmation_code is not equal'
		}
	} catch (err) {
		response.error = '0002';
		response.status = 409;
		response.message = 'Server error';
		winston.error(`Confirmation_save Failed... ::: ${err.message}`);
	}
	return response; 
}