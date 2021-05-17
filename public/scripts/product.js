import ApiService from './api.service.js';
import ChartService from './chart.service.js';


const apiService = new ApiService();

var app = new Vue({
    el: '#app',
    data: {
        product: {},
        searchTerm: {},
        id: "",
        chart: new ChartService(),
        loading: true,
    },
    async beforeMount() {
        this.id = window.location.search.substr(4)
        await this.getProduct()
        this.loading = false;
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
          lastPrice() {
              return this.product.prices[this.product.prices.length -1];
          }
    },
    methods: {
        getProduct: async function () {
            this.product = await apiService.execute({
                "method": "product",
                "body": {
                    "id": this.id
                }
            });
        },
        logout() {
            apiService.clearSession()
            window.location.pathname = "/login"
        },
        addChartData() {
            this.product.prices.map(({timestamp, value}) => {
              this.chart.appendData({
                date: new Date(timestamp),
                value,
              });
            });
          },
    }
})