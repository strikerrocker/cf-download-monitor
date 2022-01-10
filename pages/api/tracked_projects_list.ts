import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const db = await connectToDatabase();
  const entry = await db.db("downloads_db").collection("projects");
  var projects = [];
  var stream = await entry.find().stream();
  await stream.on("data", (doc) => {
    projects.push({id:doc.projectID,name:doc.name});
  });
  await stream.on("end", () => {
    res.statusCode = 200;
    console.log(projects);
    return res.json(projects);
  });
};