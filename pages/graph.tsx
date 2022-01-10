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

var simpleTime = (dateTime) => dateTime.slice(0, -8).replace("T", " ");

export default function Graph() {
  var tracked_projects = [];
  var project_downloads = [];
  var dates = [];
  var labels = [];
  const [tracked_projects_list, setTrackedProjects] = useState([]);
  const [project_downloads_list, setProjectDownloads] = useState([]);
  const [labels_list, setLabels] = useState([]);
  const [disabled,setDisabled]=useState(true);
  var chartRef = useRef();

  React.useEffect(() => {
    const fetchData = async () =>
      fetch("/api/tracked_projects_list")
        .then((res) => res.json())
        .then(async (tracked_projects_res) => {
          console.log(tracked_projects_res)
          for (var i = 0; i < tracked_projects_res.length; i++) {
            var data = tracked_projects_res[i];
            tracked_projects.push({ id: data.id, name: data.name });
          }

          setTrackedProjects(tracked_projects);
          for (var i = 0; i < tracked_projects.length; i++) {
            var id = tracked_projects[i].id;
            var res;
            await fetch("/api/get_download_history?projectID=" + id)
              .then((data) => data.json())
              .then((data) => (res = data));
            project_downloads[id] = res.data;
            for (var a of project_downloads[id]) {
              var date = new Date(a["dateTime"]);
              if (!dates.includes(date)) dates.push(date);
            }
          }
          setProjectDownloads(project_downloads);
          labels = dates.map((date) => date.getTime());
          labels.sort((a, b) => a - b);
          labels = labels
            .map((time) => simpleTime(new Date(time).toISOString()))
            .filter((date, i, array) => array.indexOf(date) === i);
          setLabels(labels);
          console.log("Done");

          setDisabled(false);
          // while (selectRef != null && selectRef.current != null && !selectRef.current.disabled) {
          //   selectRef.current.disabled = false;
          // }
        });
    fetchData();
  }, []);

  var data = {
    labels: labels,
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
    var equal_index = tracked_downloads.length == labels_list.length;
    var downloads = [],
      dates = [];
    var pushData = (date, download) => {
      if (!downloads.includes(download) && !dates.includes(date)) {
        downloads.push(download);
        dates.push(date);
      }
    };
    for (var i = 0; i < labels_list.length; i++) {
      var labelDate = labels_list[i];
      if (equal_index && labelDate == simpleTime(tracked_downloads[i].dateTime))
        pushData(labelDate, tracked_downloads[i].downloads);
      else {
        for (var j = 0; j < tracked_downloads.length; j++) {
          var data = tracked_downloads[j];
          if (simpleTime(data["dateTime"]) == labelDate)
            pushData(labelDate, data["downloads"]);
        }
      }
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
            showSearch
            filterOption={(input, option) =>
              option.children
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
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
