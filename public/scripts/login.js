import ApiService from './api.service.js';

const apiService = new ApiService();

var app = new Vue({
  el: '#app',
  data: {
    email: "",
    password: ""
  },
  methods: {
    login: async function (e) {
      e.preventDefault();

      const authLogin = await apiService.execute({
        method: "auth.login",
        body: {
          email: this.email,
          password: this.password
        }
      }, false);

      if (authLogin) {
        apiService.storeSession(authLogin);
        window.location.pathname = "/";
      }
    },
  }
})