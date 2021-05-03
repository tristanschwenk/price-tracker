var app = new Vue({
    el: '#app',
    data: {
        userName: "Zao",
        productNbr : 10,
        bestDealValue : -100,
        totalEco: 250,
    },

    mounted() {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
        
            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.paddingRight = 20;
        
            // Add data
            chart.data = [{
                "date": "2012-03-01",
                "price": 20,
              }, {
                "date": "2012-03-02",
                "price": 75,
              }, {
                "date": "2012-03-03",
                "price": 15,
              }, {
                "date": "2012-03-04",
                "price": 75
              }, {
                "date": "2012-03-05",
                "price": 158
              }, {
                "date": "2012-03-06",
                "price": 57
              }, {
                "date": "2012-03-07",
                "price": 107
              }, {
                "date": "2012-03-08",
                "price": 89
              }, {
                "date": "2012-03-09",
                "price": 75
              }, {
                "date": "2012-03-10",
                "price": 132
              }, {
                "date": "2012-03-11",
                "price": 380
              }, {
                "date": "2012-03-12",
                "price": 56
              }, {
                "date": "2012-03-13",
                "price": 169
              }, {
                "date": "2012-03-14",
                "price": 24
              }, {
                "date": "2012-03-15",
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
    }
})