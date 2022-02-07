import { connectToApi, connectToCfApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  var t1 = new Date();
  var updatedProjects = [];
  var response = await connectToApi("tracked_projects");
  var projects = Array.from(response.data);
  for (var i = 0; i < projects.length; i++) {
    var id = projects[i];
    var projectData = await (await connectToCfApi("v1/mods/"+id)).json()
    addDwnldEntry(id, projectData.data.name, projectData.data.downloadCount, projectData.data.dateModified);
    updatedProjects.push({
      project_name: projectData.data.name,
      download_count: projectData.data.downloadCount,
    });
    if (i == projects.length - 1) {
      var t2 = new Date();
      var message = {
        updated_projects: updatedProjects,
        start_time: t1,
        end_time: t2,
      };
      console.log(message);
      return res.status(200).json(message);
    }
  }
};

export async function addDwnldEntry(id, name, downloads, dateTime) {
  const db = await connectToDatabase();
  await db.db("downloads_db").collection("test_projects_downloads").insertOne({
    id: id,
    name: name,
    downloads: downloads,
    dateTime: dateTime,
  });
}
