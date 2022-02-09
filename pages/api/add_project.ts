import { connectToDatabase } from "./_connector";
import { getHandledResponseCF } from "./_helper";

export default async (req, res) => {
  console.log(req.body)
  var message;
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var projectID = parseInt(req.body.projectID);
    var response = await getHandledResponseCF("v1/mods/" + projectID);
    const client = await connectToDatabase();
    client
      .db("downloads_db")
      .collection("projects")
      .insertOne({ projectID: projectID, name: response.data.name });
    message = "Added project " + projectID + " successfully.";
    console.log(message);
    res.status(202).json({ success: message });
  } else {
    message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    res.status(400).json({ error: message });
  }
};
