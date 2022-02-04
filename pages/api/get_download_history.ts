import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  var params = new URL(req.url, `http://${req.headers.host}`).searchParams;
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
  const db = await connectToDatabase();
  const entry = await db.db("downloads_db").collection("projects_downloads");
  var projectDownloads = [];
  var stream = await entry.find().stream();
  var projectName = "";
  await stream.on("data", (doc) => {
    if (doc.id == projectID) {
      if (projectName == "") projectName = doc.name;
      projectDownloads.push({
        downloads: doc.downloads,
        dateTime: doc.dateTime,
      });
    }
  });
  await stream.on("end", () => {
    var message = {
      success: "Got historic downloads for project " + projectID,
      projectID: projectID,
      projectName: projectName,
      data: projectDownloads,
    };
    console.log(message.success);
    return res.status(200).json(message);
  });
}
