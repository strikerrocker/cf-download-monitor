import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  var params = new URL(req.url, `http://${req.headers.host}`).searchParams;

  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    res.statusCode = 500;
    var a = await getData(res, req.body.projectID);
    return a;
  } else if (
    params.has("projectID") &&
    params.get("projectID") != undefined &&
    params.get("projectID") != ""
  ) {
    res.statusCode = 500;
    var a = await getData(res, params.get("projectID"));
    return a;
  } else {
    res.statusCode = 400;
    var message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.json({ error: message });
  }
};

async function getData(res, projectID) {
  const db = await connectToDatabase();
  const entry = await db.db("downloads_db").collection("projects_downloads");
  var projectDownloads = [];
  var stream = await entry.find().stream();
  await stream.on("data", (doc) => {
    if (doc.id == projectID) {
      delete doc._id;
      projectDownloads.push(doc);
    }
  });
  await stream.on("end", () => {
    var message = {
      success: "Got historic downloads for project " + projectID,
      data: projectDownloads,
    };
    res.statusCode = 200;
    console.log(message.success);
    return res.json(message);
  });
}
