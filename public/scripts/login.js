import ApiService from './api.service.js';

const apiService = new ApiService();
if (apiService.isAuthentificated()) window.location.pathname = "/";

var app = new Vue({
  el: '#app',
  data: {
    email: "",
    password: ""
  },
  beforeMount() {
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