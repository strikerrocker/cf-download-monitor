import { connectToDatabase } from "./_connector";
import { addDwnldEntry, getHandledResponseCF } from "./_helper";

export default async (req, res) => {
  var t1 = new Date();
  var updatedProjects = [];
  const client = await connectToDatabase();
  const entry = await client.db("downloads_db").collection("projects");
  var projects = (await entry.find().toArray()).map((a) => a.projectID);
  for (var id of projects) {
    var projectData = await getHandledResponseCF("v1/mods/" + id);
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