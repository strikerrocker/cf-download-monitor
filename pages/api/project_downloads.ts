import { sendToCFProxyAPI } from "./_connector";

export default async (req, res) => {
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    return await getDownloads(req.body.projectID, res);
  } else if (
    req.query.projectID != undefined &&
    req.query.projectID != ""
  ) {
    return await getDownloads(req.query.projectID, res);
  } else {
    var message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.status(400).json({ error: message });
  }
};

async function getDownloads(projectID, res) {
  var response = await sendToCFProxyAPI("v1/mods/"+projectID);
  var downloadCount = response.data.downloadCount;
  var message = "Got downloads for project " + projectID;
  console.log(message);
  return res
    .status(200)
    .json({ downloadCount: downloadCount, success: message });
}
