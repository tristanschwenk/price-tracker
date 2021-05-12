import ApiService from './api.service.js';
import ChartService from './chart.service.js';

const apiService = new ApiService();

var app = new Vue({
  el: '#app',
  data: {
    apiUrl: 'http://localhost:3002',
    searchTerm: "",
    products: [],
    chart: new ChartService(),
  },
  async beforeMount() {
    if (!apiService.isAuthentificated()) return window.location.pathname = "/login";

    await this.getProduct();

    if (this.products.length==0) return window.location.pathname = "/add_product";


    document.getElementById('loader').remove();
  },
  mounted() {
    window.vueInstance = this;

    this.chart.initChart();
  },
  computed: {
    user() {
      return apiService.getSession().user;
    },
    bestDeal() {
      const sorted = [...this.products]
        .sort((a, b) => a.priceDiff - b.priceDiff)
        .reverse();

      return sorted[0] || {};
    },
    totalSaving() {
      return this.products.reduce((acc, product) => acc += product.priceDiff, 0);
    }
  },
  methods: {
    sendForm: async function () {

      const product = await apiService.execute({
        method: "product.create",
        body: {
          url: this.searchTerm
        }
      })

      this.getProduct()
    },
    getProduct: async function () {
      this.products = await apiService.execute({
        "method": "product.all",
      });

      this.addChartData();
    },
    convertDate(timestamp) {
      return new Date(timestamp)
    },
    addChartData() {
      if(!this.bestDeal.prices) return;
      this.bestDeal.prices.map(({timestamp, value}) => {
        this.chart.appendData({
          date: this.convertDate(timestamp),
          value,
        });
      });
    }
  }
})