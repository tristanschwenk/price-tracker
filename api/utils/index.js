const colors = require('colors');
const APIError = require('./ApiError');
const Method = require('./Method');
const AmazonService = require('../services/amazon');
const AuthService = require('../services/auth');

exports.flattenObject = (ob) => {
	var toReturn = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

		if ((typeof ob[i]) == 'object' && !(ob[i] instanceof Method)) {
			var flatObject = exports.flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				if (i === x) toReturn[x] = flatObject[x];
				else toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

exports.logger = (query, ...messages) => {
	const name = (typeof query === 'string') ? query : query?.method;
	console.log(`${new Date().toLocaleTimeString('fr-FR').green} [${(name || "System").toUpperCase().yellow}]`, ...messages);
}

/**
 * Compare data object to match key and type from schema object
 */
exports.isDataValid = (data, schema) => {
	for (const key in schema) {
		let expectedType = typeof schema[key];
		if ( expectedType === 'function' ) {
			expectedType = typeof schema[key]();
		}

		if (typeof data[key] !== expectedType)
			return false;

		if ( expectedType === 'object' && !Array.isArray(schema[key])) {
			if(exports.isDataValid(data[key], schema[key]) === false) {
				return false
			}
		}
	}

	return true;
}

exports.buildAPI = (apiObject, shared={}) => {
	const methods = exports.flattenObject(apiObject);

	for (const method in methods) {
		exports.logger(null, `Method added: ${method}`)
	}
	
	return async (req, res, next) => {

		const auth = AuthService.authMiddleware(req, res);

		let body = req.body;

		if (typeof body !== 'object') {
			return res.send({
				errors: [{
					message: "object or array expected"
				}]
			});
		}

		let results = {},
			hasErrors = false;

		if (!Array.isArray(body)) {
			body = [body];
		}

		for (const query of body) {
			if(query.method.startsWith('#')) continue;
			const result = await _executeQuery(query);
			results[query.method] = result;
			hasErrors = (result instanceof APIError) ? true : hasErrors;
		}

		res.send({
			...results,
			hasErrors
		});

		async function _executeQuery(query) {
			if (typeof query.method !== 'string' ||
				typeof methods[query.method] !== 'object') {
				exports.logger(query, 'Not found');
				return APIError.methodNotFound
			}

			const method = methods[query.method];
			const opts = {
				...shared,
				query,
				data: query.data || query.body || {},
				req,
				auth,
				logger: (...messages) => exports.logger(query, ...messages),
			}

			for (const rule of method.rules) {
				if( await rule(opts) === false) return APIError.notAuthorized
			}

			if (!exports.isDataValid(opts.data, method.schema)) return APIError.missingField;

			try {
				return await methods[query.method].execute(opts);
			} catch (error) {
				if (error instanceof APIError) {
					return error;
				} else {
					exports.logger(query, 'Unhandled error:');
					exports.logger(query, error);
					return APIError.unhandled;
				}
			}
		}

	};
}