import { connectToCfApi } from "./_connector";

export default async (req, res) => {
  var { projectID } = req.body;
  if (projectID !== undefined && projectID !== "") {
    await getDownloads(req.body.projectID, res);
  } else if (req.query.projectID != undefined && req.query.projectID != "") {
    await getDownloads(req.query.projectID, res);
  } else {
    var message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.status(400).json({ error: message });
  }
};

async function getDownloads(projectID, res) {
  var response = await (await connectToCfApi("v1/mods/" + projectID)).json();
  var data = response.data;
  var message = "Got downloads for project " + data.name + " with id " + projectID;
  console.log(message);
  res.status(200).json({ downloadCount: data.downloadCount, success: message });
}
