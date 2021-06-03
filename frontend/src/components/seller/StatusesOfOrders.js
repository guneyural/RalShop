import React, { useState, useEffect } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const StatusesOfOrders = ({
  confirmed = 0,
  confirmationRequired = 0,
  cancelled = 0,
  shipped = 0,
  delivered = 0,
  customerRequestedToCancel = 0,
  packing = 0,
}) => {
  const [chartData, setChartData] = useState([
    { label: "confirmed", value: confirmed },
    { label: "confirmation required", value: confirmationRequired },
    { label: "cancelled", value: cancelled },
    { label: "shipped", value: shipped },
    { label: "delivered", value: delivered },
    { label: "customer requested to cancel", value: customerRequestedToCancel },
    { label: "packing", value: packing },
  ]);

  useEffect(() => {
    setChartData([
      { label: "confirmed", value: confirmed },
      { label: "confirmation required", value: confirmationRequired },
      { label: "cancelled", value: cancelled },
      { label: "shipped", value: shipped },
      { label: "delivered", value: delivered },
      {
        label: "customer requested to cancel",
        value: customerRequestedToCancel,
      },
      { label: "packing", value: packing },
    ]);
  }, [
    confirmed,
    confirmationRequired,
    cancelled,
    shipped,
    delivered,
    customerRequestedToCancel,
    packing,
  ]);

  const chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    height: "320",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Statuses Of Orders",
        xAxisName: "Orders",
        yAxisName: "Status",
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
