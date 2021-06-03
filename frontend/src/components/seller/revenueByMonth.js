import React, { useState, useEffect } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const RevenueByMonthChart = () => {
  const [chartData, setChartData] = useState([
    { label: "Jan-21", value: "100" },
    { label: "Feb-21", value: "50" },
    { label: "Mar-21", value: "768" },
    { label: "Apr-21", value: "310" },
    { label: "May-21", value: "220" },
    { label: "Jun-21", value: "520" },
    { label: "Jul-21", value: "875" },
    { label: "Aug-21", value: "985" },
    { label: "Sep-21", value: "1258" },
    { label: "Oct-21", value: "4732" },
    { label: "Nov-21", value: "3568" },
    { label: "Dec-21", value: "2540" },
  ]);

  const chartConfigs = {
    type: "column2d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Monthly Income",
        xAxisName: "Date",
        yAxisName: "Money",
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

export default RevenueByMonthChart;
