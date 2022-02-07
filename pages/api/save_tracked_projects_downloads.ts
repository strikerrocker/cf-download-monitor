import { connectToCfApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  var t1 = new Date();
  var updatedProjects = [];
  const client = await connectToDatabase();
  const entry = await client.db("downloads_db").collection("projects");
  var projects = (await entry.find().toArray()).map((a) => a.projectID);
  for (var id of projects) {
    var projectData = await (await connectToCfApi("v1/mods/" + id)).json();
    addDwnldEntry(client,id, projectData.data.name, projectData.data.downloadCount, projectData.data.dateModified);
    updatedProjects.push({
      project_name: projectData.data.name,
      download_count: projectData.data.downloadCount,
    });
  }
  var t2 = new Date();
  var message = {
    updated_projects: updatedProjects,
    start_time: t1,
    end_time: t2,
  };
  console.log(message);
  res.status(200).json(message);
};

export function addDwnldEntry(client,id, name, downloads, dateTime) {
  client.db("downloads_db").collection("projects_downloads").insertOne({
    id: id,
    name: name,
    downloads: downloads,
    dateTime: dateTime,
  });
}