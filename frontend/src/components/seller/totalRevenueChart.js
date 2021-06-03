import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, TimeSeries, FusionTheme);

const HomePageDashboard = () => {
  const fusionTable = new FusionCharts.DataStore().createDataTable(
    [
      ["01-Jan-04", 125800],
      ["01-Feb-04", 132500],
      ["01-Mar-04", 168500],
      ["01-Apr-04", 985400],
      ["01-May-04", 1085400],
      ["01-Jun-04", 985400],
      ["01-Jul-04", 400000],
      ["01-Aug-04", 85002],
    ],
    [
      {
        name: "Time",
        type: "date",
        format: "%d-%b-%y",
      },
      {
        name: "Total Revenue",
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
      yAxis: [{ plot: "Footfall", plottype: "line", title: "revenue" }],
      data: fusionTable,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default HomePageDashboard;
