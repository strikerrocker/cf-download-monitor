import { getTrackedProjects } from "./_helper";

export default async (req, res) => {
  var updatedProjects = [];
  var projects = await getTrackedProjects();
  projects.forEach((id) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    fetch("https://cf-download-monitor.vercel.app/api/update_project_backend", {
      method: "POST",
      body: JSON.stringify({
        projectID: id,
      }),
      headers: headers,
    }).catch((e) => console.log(e));
    updatedProjects.push(id);
  });
  console.log("Updated backend data for projects : " + JSON.stringify(updatedProjects));
  res.status(200).json({
    updated_projects: updatedProjects,
  });
};
