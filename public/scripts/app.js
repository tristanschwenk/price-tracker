import ApiService from './api.service.js';

const apiService = new ApiService();

var app = new Vue({
  el: '#app',
  data: {
    apiUrl: 'http://localhost:3002',
    userName: "Zao",
    totalEco: 0,
    sendURL: "",
    products: [],
    chartData: []
  },
  async beforeMount() {
    await this.getProduct();
    document.getElementById('loader').remove();
  },
  mounted() {
    console.log(this.products)
    this.addChartData()

    window.vueInstance = this;
    am4core.ready(function () {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.paddingRight = 20;

      // Add data
      chart.data = [{
        "date": "2021-04-21",
        "price": 20,
      }, {
        "date": "2021-04-22",
        "price": 75,
      }, {
        "date": "2021-04-23",
        "price": 15,
      }, {
        "date": "2021-04-24",
        "price": 75
      }, {
        "date": "2021-04-25",
        "price": 158
      }, {
        "date": "2021-04-26",
        "price": 57
      }, {
        "date": "2021-04-27",
        "price": 107
      }, {
        "date": "2021-04-28",
        "price": 89
      }, {
        "date": "2021-04-29",
        "price": 75
      }, {
        "date": "2021-04-30",
        "price": 132
      }, {
        "date": "2021-05-01",
        "price": 380
      }, {
        "date": "2021-05-02",
        "price": 56
      }, {
        "date": "2021-05-03",
        "price": 169
      }, {
        "date": "2021-05-04",
        "price": 24
      }, {
        "date": "2021-05-05",
        "price": 147
      }];

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 50;

      // Create value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.baseValue = 200;

      // Create series
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "price";
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.stroke = am4core.color("#F6583C");
      series.tensionX = 0.77;

      // bullet is added because we add tooltip to a bullet for it to change color
      var bullet = series.bullets.push(new am4charts.Bullet());
      bullet.tooltipText = "{valueY}";

      bullet.adapter.add("fill", function (fill, target) {
        if (target.dataItem.valueY < valueAxis.baseValue) {
          return am4core.color("#3FC555");
        }
        return am4core.color("#F6583C");
      })
      var range = valueAxis.createSeriesRange(series);
      range.value = 200;
      range.endValue = -1000;
      range.contents.stroke = am4core.color("#3FC555");
      range.contents.fill = range.contents.stroke;

      // Add scrollbar

      chart.cursor = new am4charts.XYCursor();
    });


  },
  computed: {
    bestDeal() {
      const sorted = [...this.products]
        .sort((a, b) => a.priceDiff - b.priceDiff)
        .reverse();

      return sorted[0];
    },
    // getMostData: function () {
    //   for (let index = 0; index < this.products[this.bestDeal.id].prices.length; index++) {
    //     const element = this.products[this.bestDeal.id].prices[index];
    //     this.chartData.push({
    //       "data": new Date(element.timestamp),
    //       "price": element.value
    //     })
    //   }
    //   console.log(this.chartData);
    // },
  },
  methods: {
    sendForm: function () {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "method": "product.create",
        "data": {
          "url": `${this.sendURL}`
        }
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://localhost:3002/", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          this.getProduct()
        })
        .catch(error => console.log('error', error));

    },
    getProduct: async function () {
      this.products = await apiService.execute({
        "method": "product.all",
      });

      console.log(this.products);
      this.convertDate()
    },
    convertDate() {
      this.products.map((product) => {
        return product.prices.map(price => {
          return price.timestamp = new Date(price.timestamp).toLocaleDateString();
        })
      })
    },
    addChartData() {
      this.products.map((product) => {
        product.prices.map(price => {
          this.chartData.append({
            "date": price.timestamp,
            "value": price.value
          })
        })
      })
    }
  }
})