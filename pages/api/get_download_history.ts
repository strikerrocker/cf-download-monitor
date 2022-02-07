import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var a = await getData(res, parseInt(req.body.projectID));
    return a;
  } else if (req.query.projectID != undefined && req.query.projectID != "") {
    var a = await getData(res, parseInt(req.query.projectID));
    return a;
  } else {
    var message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.status(400).json({ error: message });
  }
};

async function getData(res, projectID) {
  const client = await connectToDatabase();
  const entry = await client.db("downloads_db").collection("projects_downloads");
  var projectDownloads = [];
  var projectName = "";
  var a = await entry.find().toArray();
  for(var doc of a){
    if (doc.id == projectID) {
      if (projectName == "") projectName = doc.name;
      projectDownloads.push({
        downloads: doc.downloads,
        dateTime: doc.dateTime,
      });
    }
  }
  var message = {
    success: "Got historic downloads for project " + projectID,
    projectID: projectID,
    projectName: projectName,
    data: projectDownloads,
  };
  console.log(message.success);
  return res.status(200).json(message);
}
