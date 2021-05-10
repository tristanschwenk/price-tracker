import ApiService from './api.service.js';

const apiService = new ApiService();


var app = new Vue({
    el: '#app',
    data: {
      email: "",
      password: ""
    },
    methods: {
      login: async function () {
        const login = await apiService.execute({
          "method": "auth.login",
          "body": {
              email: this.email,
              password: this.password
          }
        }, false);
        
        if(login['auth.login']){
            localStorage.setItem('accessToken', login['auth.login'].token)
            window.location.pathname="/"
        }
      },
    }
  })