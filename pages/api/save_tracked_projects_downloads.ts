import { connectToApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  var t1 = new Date();
  const db = await connectToDatabase();
  var updatedProjects = [];
  var response = await connectToApi("tracked_projects");
  var projects = Array.from(response.data);
  for (var i = 0; i < projects.length; i++) {
    var id = projects[i];
    var response = await connectToApi("project_data?projectID="+id);
    await addToDB(db, id, response.data.name, response.data.downloadCount, response.data.dateModified);
    updatedProjects.push({
      project_name: response.data.name,
      download_count: response.data.downloadCount,
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

async function addToDB(db, id, name, downloads, dateTime) {
  await db.db("downloads_db").collection("projects_downloads").insertOne({
    id: id,
    name: name,
    downloads: downloads,
    dateTime: dateTime,
  });
}
