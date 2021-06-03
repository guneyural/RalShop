import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../../assets/loading.gif";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import ReactFC from "react-fusioncharts";

ReactFC.fcRoot(FusionCharts, TimeSeries);

const HomePageDashboard = () => {
  const [schema, setSchema] = useState([
    { name: "Time", type: "date", format: "%-m/%-d/%Y" },
    { name: "Sales", type: "number" },
  ]);
  const [data, setData] = useState([
    ["1/4/2011", 16.448],
    ["1/5/2011", 272.736],
    ["1/5/2011", 11.784],
    ["12/31/2014", 20.72],
    ["12/31/2014", 13.904],
    ["12/31/2014", 3.024],
  ]);
  const [ChartConfig, setChartConfig] = useState({
    timeseriesDs: {
      type: "timeseries",
      renderAt: "contianer",
      width: "600",
      height: "400",
      dataSource: {
        caption: { text: "Online Sales of a SuperStore in the US" },
        data,
        yAxis: [{ plot: [{ value: "Sales ($)" }] }],
      },
    },
  });

  useEffect(() => {
    const fusionTable = new FusionCharts.DataStore().createDataTable(
      data,
      schema
    );
  }, []);

  return (
    <>
      <ReactFC {...ChartConfig} />
    </>
  );
};

export default HomePageDashboard;
