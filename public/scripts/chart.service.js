export default class ChartService {
  constructor() {
    this.chart = null;
  }

  initChart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    this.chart.paddingRight = 20;

    // Add data
    this.chart.data = [];

    // Create axes
    var dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.location = 0;
    // dateAxis.renderer.minGridDistance = 50;

    // Create value axis
    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 200;

    // Create series
    var series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.stroke = am4core.color("#F6583C");
    series.tensionX = 0.77;

    // bullet is added because we add tooltip to a bullet for it to change color
    var bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = "{valueY} €";

    bullet.adapter.add("fill", function (_fill, target) {
      console.log(target, valueAxis.baseValue);
      if (target.dataItem.valueY < valueAxis.baseValue) {
        return am4core.color("#3FC555");
      }else if(target.dataItem.valueY == valueAxis.baseValue) {
        return am4core.color("#FFFFFF");
      }else{
        return am4core.color("#F6583C");
      }
    })

    var range = valueAxis.createSeriesRange(series);
    range.value = 200;
    range.endValue = -1000;
    range.contents.stroke = am4core.color("#3FC555");
    range.contents.fill = range.contents.stroke;

    // Add scrollbar

    this.chart.cursor = new am4charts.XYCursor();
  }

  appendData(data) {
    this.chart.addData(data);
  }
}