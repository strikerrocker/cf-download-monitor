import { connectToApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  const db = await connectToDatabase();
  var message;
  if (req.body !== "" && req.body.projectID !== undefined && req.body.projectID !== "") {
    var response = await connectToApi("project_data", {
      projectID: req.body.projectID,
    });
    await db.db("downloads_db").collection("projects").insertOne({ projectID: req.body.projectID,name:response.data.name });
    message="Added project " + req.body.projectID + " successfully.";
    console.log(message);
    res.statusCode = 202;
    return res.json({ success: message });
  } else {
    res.statusCode = 400;
    message = "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.json({ error: message });
  }
};
