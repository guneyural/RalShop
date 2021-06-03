import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, TimeSeries, FusionTheme);

const OrdersByMonth = () => {
  const fusionTable = new FusionCharts.DataStore().createDataTable(
    [
      ["01-Jan-04", 1],
      ["01-Feb-04", 5],
      ["01-Mar-04", 3],
      ["01-Apr-04", 9],
      ["01-May-04", 19],
      ["01-Jun-04", 14],
      ["01-Jul-04", 7],
      ["01-Aug-04", 8],
    ],
    [
      {
        name: "Time",
        type: "date",
        format: "%d-%b-%y",
      },
      {
        name: "Ordered",
        type: "number",
      },
    ]
  );

  const chartConfigs = {
    type: "timeseries",
    width: "100%",
    height: "400",
    dataFormat: "json",
    renderAt: "container",
    dataSource: {
      navigator: { enabled: 0 },
      yAxis: [{ plot: "Footfall", plottype: "line", title: "orders" }],
      data: fusionTable,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default OrdersByMonth;
