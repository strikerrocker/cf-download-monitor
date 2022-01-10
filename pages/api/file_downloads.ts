import axios from "axios";
import { connectToCfApi } from "./_connector";

export default async (req, res) => {
  var message;
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== "" &&
    req.body.fileID !== undefined &&
    req.body.fileID !== ""
  ) {
    var response = await connectToCfApi(
      "v1/mods/" + req.body.projectID + "/files/" + req.body.fileID
    );
    var downloadCount = response.data.data.downloadCount;
    message = "Got download count for file "+req.body.fileID+" in project "+req.body.projectID;
    console.log(message);
    res.statusCode=200;
    return res.json({ downloadCount: downloadCount,message:message });
  } else {
    res.statusCode = 400;
    message = "Invalid data. Expected projectID and fileID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.json({ error: message });
  }
};
