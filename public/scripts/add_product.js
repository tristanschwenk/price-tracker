import ApiService from './api.service.js';

const apiService = new ApiService();

var app = new Vue({
  el: '#app',
  data: {
    productUrl: "",
    searchTerm: "",
    product: [],
  },
  async beforeMount() {
    if (!apiService.isAuthentificated()) return window.location.pathname = "/login";
  },
  mounted() {
    window.vueInstance = this;
    document.getElementById('loader').remove();
  },
  computed: {
    user() {
      return apiService.getSession().user;
    }
  },
  methods: {
    importProduct: async function (e) {
      e.preventDefault();

      const product = await apiService.execute({
        method: "product.create",
        body: {
          url: this.productUrl
        }
      })

      if(!product.error) window.location.pathname="/";

      alert(product.error.message);
      console.log(product);
    },
    logout() {
      apiService.clearSession()
      window.location.pathname = "/login"
  },
  }
})