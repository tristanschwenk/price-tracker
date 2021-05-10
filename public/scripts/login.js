var app = new Vue({
    el: '#app',
    data: {
      email: "",
      password: ""
    },
    async beforeMount() {
      await this.getProduct();
    },
    methods: {
      login: async function () {
        const login = await this.callApi({
          "method": "auth.login",
          "body": {
              email: this.email,
              password: this.password
          }
        });
        
        console.log(login);
      },
    }
  })