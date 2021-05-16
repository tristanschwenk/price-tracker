import ApiService from './api.service.js';

const apiService = new ApiService();
if (apiService.isAuthentificated()) window.location.pathname = "/";

var app = new Vue({
    el: '#app',
    data: {
        name: "",
        email: "",
        password: ""
    },
    beforeMount() {},
    methods: {
        register: async function (e) {
            e.preventDefault();

            const authLogin = await apiService.execute({
                method: "auth.register",
                body: {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }
            }, false);

            window.location.pathname = "/login";

        },
    }
})