import React, { useEffect, useState } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const StatusesOfOrders = () => {
  const [chartData, setChartData] = useState([
    { label: "javascript", value: 100 },
    { label: "Güney", value: 100 },
    { label: "Ural", value: 100 },
    { label: "Cano", value: 100 },
  ]);

  const chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Stars Per Language",
        xAxisName: "Repositories",
        yAxisName: "Stars",
        theme: "fusion",
      },
      data: chartData,
    },
  };

  return (
    <>
      <ReactFC {...chartConfigs} />
    </>
  );
};

export default StatusesOfOrders;
