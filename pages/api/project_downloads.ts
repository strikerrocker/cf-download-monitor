import { connectToApi } from "./_connector";

export default async (req, res) => {
  var message;
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var response = await connectToApi("project_data", {
      projectID: req.body.projectID,
    });
    var downloadCount = response.data.downloadCount;
    message = "Got downloads for project " + req.body.projectID;
    console.log(message);
    res.statusCode = 200;
    return res.json({ downloadCount: downloadCount,success:message });
  } else {
    res.statusCode = 400;
    message = "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.json({ error: message });
  }
};
