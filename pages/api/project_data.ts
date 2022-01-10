import { connectToCfApi } from "./_connector";

export default async (req, res) => {
  var params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  res.statusCode = 200;
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var data = await getData(req.body.projectID);
    return res.json(data);
  } else if (
    params.has("projectID") &&
    params.get("projectID") != undefined &&
    params.get("projectID") != ""
  ) {
    var data = await getData(params.get("projectID"));
    return res.json(data);
  } else {
    res.statusCode = 400;
    var message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.json({ error: message });
  }
};

async function getData(projectID) {
  var response = await connectToCfApi("v1/mods/" + projectID);
  var data = response.data.data;
  console.log("Got project details for project " + projectID);
  return data;
}
