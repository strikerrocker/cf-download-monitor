import Head from "next/head";
import { Layout, Select } from "antd";
import graphStyles from "../styles/Graph.module.css";
import { Content } from "antd/lib/layout/layout";
import ATitle from "antd/lib/typography/Title";
import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

var simpleTime = (dateTime) => {
  var date = new Date(dateTime);
  return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear().toString().substring(-2)
  +" "+date.getHours()+":"+('0'+date.getMinutes()).slice(-2);
};

export default function Graph() {
  var tracked_projects = [];
  var project_downloads = [];
  const [tracked_projects_list, setTrackedProjects] = useState([]);
  const [project_downloads_list, setProjectDownloads] = useState([]);
  const [disabled, setDisabled] = useState(true);
  var chartRef = useRef();

  React.useEffect(() => {
    const fetchData = async () =>
      fetch("/api/tracked_projects_list")
        .then((res) => res.json())
        .then(async (projects_res) => {
          for (var i = 0; i < projects_res.length; i++) {
            var data = projects_res[i];
            await fetch("/api/get_download_history?projectID=" + data.id)
              .then((res) => res.json())
              .then((history_res) => {
                project_downloads[data.id] = history_res.data;
              });
            tracked_projects.push({ id: data.id, name: data.name });
          }
          setTrackedProjects(tracked_projects);
          setProjectDownloads(project_downloads);
          console.log("Fetched Download history.");
          alert("Fetched Download history.")
          setDisabled(false);
        });
    fetchData();
  }, []);

  var data = {
    datasets: [
      {
        label: "Nothing",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const onSelected = async (id, selectedIndex) => {
    var tracked_downloads = project_downloads_list[id];
    var downloads = [],
      dates = [];
    var pushData = (date, download) => {
      if (!downloads.includes(download)) {
        downloads.push(download);
        dates.push(date);
      }
    };
    for (var j = 0; j < tracked_downloads.length; j++) {
      var data = tracked_downloads[j];
      pushData(simpleTime(data["dateTime"]), data["downloads"]);
    }
    if (chartRef != undefined && chartRef.current != undefined) {
      chartRef.current.data.labels = dates;
      chartRef.current.data.datasets[0].data = downloads;
      chartRef.current.data.datasets[0].label = selectedIndex.children;
      chartRef.current.update();
    }
  };
  const options = tracked_projects_list.map((data) => (
    <Select.Option key={data.id} value={data.id}>
      {data.name}
    </Select.Option>
  ));
  return (
    <Layout>
      <Head>
        <title>Downloads Graphs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content className={graphStyles.content}>
        <ATitle level={3} className={graphStyles.title}>
          Select project to display historic downloads for :
          <Select
            className={graphStyles.select}
            onChange={onSelected}
            disabled={disabled}
          >
            {options}
          </Select>
        </ATitle>
        <Line options={{ responsive: true }} data={data} ref={chartRef}></Line>
      </Content>
    </Layout>
  );
}
