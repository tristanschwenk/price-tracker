export default class ApiService {
  constructor(apiUrl, prefix) {
    this.apiUrl = apiUrl || 'http://localhost:3002';
    this.prefix = prefix || 'price-tracker';
  }

  async execute(body, addJWTHeader = true, isRefreshRequest = false) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    if (addJWTHeader === true) {

      const session = this.getSession();
      if (session && session.token) {

        if (session.exp * 1000 <= Date.now() && !isRefreshRequest) {
          console.log('Access token expired, need to request a new one...');
          session = await this.refreshTokens();
          if (!session) {
              return {};
          }
        }

        requestOptions.headers['Authorization'] = 'Bearer ' + session.token;
      }
    }

    return fetch(this.apiUrl, requestOptions).then(this.handleResponse)
  }

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        console.log(`[API] Unexpected http code: ${response.status}`)
        console.log(`[API] Data:`, data)
        return Promise.reject(response.statusText);
      } else if (typeof data === 'object') {
        if (data.hasErrors === true) {
          console.log(`[API] Api error: `, data);

          // for (const method in data) {
          //     if (Object.hasOwnProperty.call(data, method)) {
          //         const methodResponse = data[method];
          //         if (methodResponse.error && methodResponse.error.message == 'Not authorized') {
          //             location.reload(true);

          //         } else if (methodResponse.error) {
          //             console.log(`[API] Api error: `, methodResponse.error);
          //         }
          //     }
          // }
        }
      }

      if (Object.keys(data).length == 2) {
        const methodName = Object.keys(data).filter((name) => name != 'hasError')[0];
        return data[methodName];
      }

      return data;
    });

  }

  storeSession(authResponse) {
    const data = {
      ...authResponse,
      user: {
        id: authResponse.user._id,
        name: authResponse.user.name,
        email: authResponse.user.email,
        lastLoginAt: authResponse.user.lastLoginAt,
      }
    }

    localStorage.setItem(`${this.prefix}-session`, JSON.stringify(data));

    return data;
  }

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(`${this.prefix}-session`));
    } catch (error) {
      console.log('[getSession] Error: ', error);

      // If data is invalid, clear it
      this.clearUser();
      return false;
    }
  }

  clearSession() {
    localStorage.removeItem(`${this.prefix}-session`);
  }

  async refreshSession() {
    const session = this.getSession();
    if (session && session.refreshToken) {
      const authRefresh = await this.execute({
        method: 'auth.refresh',
        body: {
          refreshToken: session.refreshToken
        }
      }, false, true)

      if (!authRefresh.error) {
        this.storeSession(authRefresh);
      } else {
        if (authRefresh.error) {
          switch (authRefresh.error.message) {
            case 'Account not found':
              alert('Refresh Token invalid, logging out');
              this.clearSession()
              break;
            default:
              console.log('[refreshTokens] Error: ', authRefresh.error);
              break;
          }
        }
      }

      return authRefresh;
    }

  }

  isAuthentificated() {
    const session = this.getSession();
    if(session && session.token) {
      return true;
    }

    return false;
  }

}