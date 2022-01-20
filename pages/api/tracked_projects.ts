import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const db = await connectToDatabase();
  const entry = await db.db("downloads_db").collection("projects");
  var projects = [];
  var stream = await entry.find().stream();
  await stream.on("data", (doc) => {
    projects.push(doc.projectID);
  });
  await stream.on("end", () => {
    console.log("Got tracked projects list.");
    return res.status(200).json(projects);
  });
};
