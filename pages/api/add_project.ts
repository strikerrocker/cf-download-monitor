import { connectToCfApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  const db = await connectToDatabase();
  var message;
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var projectID = parseInt(req.body.projectID);
    var response = await (await connectToCfApi("v1/mods/"+projectID)).json();
    await db
      .db("downloads_db")
      .collection("projects")
      .insertOne({ projectID: projectID, name: response.data.name });
    message = "Added project " + projectID + " successfully.";
    console.log(message);
    return res.status(202).json({ success: message });
  } else {
    message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.status(400).json({ error: message });
  }
};
