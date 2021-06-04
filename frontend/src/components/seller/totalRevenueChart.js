import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, TimeSeries, FusionTheme);

const HomePageDashboard = ({ Data = [] }) => {
  const fusionTable = new FusionCharts.DataStore().createDataTable(
    [...Data],
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
    height: "320",
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
