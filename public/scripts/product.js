import ApiService from './api.service.js';

const apiService = new ApiService();

var app = new Vue({
    el: '#app',
    data: {
        product: {},
        id: ""
    },
    async beforeMount() {
        this.id = window.location.search.substr(4)
        await this.getProduct()
        document.getElementById('loader').remove();
        console.log(this.product);
    },

    methods: {
        getProduct: async function () {
            this.products = await apiService.execute({
              "method": "product.all",
              "body": this.id
            });
      
          },
        login: async function (e) {
            e.preventDefault();

            const authLogin = await apiService.execute({
                method: "auth.login",
                body: {
                    email: this.email,
                    password: this.password
                }
            }, false);

        },
        logout() {
            apiService.clearSession()
            window.location.pathname = "/login"
        }
    }
})