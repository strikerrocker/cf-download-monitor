import { connectToCfApi } from "./_connector";

export default async (req, res) => {
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    return await getData(req.body.projectID,res);
  } else if (
    req.query.projectID != undefined &&
    req.query.projectID != ""
  ) {
    return await getData(req.query.projectID,res);
  } else {
    var message =
      "Invalid data. Expected projectID but got " + req.body;
    console.log(message);
    return res.status(400).json({ error: message });
  }
};

async function getData(projectID,res) {
  var response = await connectToCfApi("v1/mods/" + projectID);
  var data = response.data;
  console.log("Got project details for project " + projectID);
  return res.status(200).json(data);
}
