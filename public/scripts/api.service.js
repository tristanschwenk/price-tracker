export default class ApiService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl || 'http://localhost:3002';
  }

  execute(body, addJWTHeader = true, isRefreshRequest = false) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    if (addJWTHeader === true) {

      let token = localStorage.getItem('accessToken');
      if (token) {

        // if (user.expirationTime * 1000 <= Date.now() && !isRefreshRequest) {
        //   alert('Access token expired, need to request a new one...');
        //   // user = await this.refresh();
        //   // if (!user) {
        //   //     return {};
        //   // }
        // }

        requestOptions.headers['Authorization'] = 'Bearer ' + token;
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

        if(Object.keys(data).length == 2) {
          const methodName  = Object.keys(data).filter((name)=>name!='hasError')[0];
          return data[methodName];
        }

        return data;
    });

}

}