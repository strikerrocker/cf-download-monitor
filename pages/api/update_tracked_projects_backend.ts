import { connectToApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  var updatedProjects = [];
  var response = await connectToApi("tracked_projects");
  var projects = Array.from(response.data);
  console.log(projects);

  for (var i = 0; i < projects.length; i++) {
    var id = projects[i];
    connectToApi("update_project_backend", {
      projectID: id,
    });
    updatedProjects.push(id);

    if (i == projects.length - 1) {
      res.statusCode = 200;
      console.log(
        "Updated backend data for projects : " + JSON.stringify(updatedProjects)
      );
      return res.json({
        updated_projects: updatedProjects,
      });
    }
  }
};