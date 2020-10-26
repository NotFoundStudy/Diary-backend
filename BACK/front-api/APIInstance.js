require('dotenv').config();

const { DOMAIN } = process.env;

export const Auth = {
	create: (token = null) => {
		const headers = {};
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		axios.create({
			baseURL: `${DOMAIN}/api/`,
			headers: { 'X-Custom-Header': 'foobar' },
			timeout: 1000,
			headers,
		});
	},
};