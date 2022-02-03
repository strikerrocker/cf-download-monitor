import { connectToApi } from "./_connector";

export default async (req, res) => {
  var updatedProjects = [];
  var response = await connectToApi("tracked_projects");
  var projects = Array.from(response.data);
  for (var i = 0; i < projects.length; i++) {
    var id = projects[i];
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    fetch("https://cf-download-monitor.vercel.app/api/update_project_backend",{
      method:"POST",
      body :JSON.stringify({
        projectID: id,
      }),headers:headers
    });
    updatedProjects.push(id);

    if (i == projects.length - 1) {
      console.log(
        "Updated backend data for projects : " + JSON.stringify(updatedProjects)
      );
      return res.status(200).json({
        updated_projects: updatedProjects,
      });
    }
  }
};
