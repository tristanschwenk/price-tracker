class APIError {
  constructor(message) {
    this.message = message;
    this.timestamp = Date.now();
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        timestamp: this.timestamp
      }
    }
  }
}

APIError.unhandled =      new APIError('An unexpected error occured');
APIError.methodNotFound = new APIError('Method not found');
APIError.notAuthorized =  new APIError('Not authorized');
APIError.missingField =   new APIError('Missing field in body');
APIError.notFound =       new APIError('Not found');
APIError.auth = {
  accountNotFound:        new APIError('Account not found'),
  emailAlreadyUsed:       new APIError('Email already used')
}

module.exports = APIError

