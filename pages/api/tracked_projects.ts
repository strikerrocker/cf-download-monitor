import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const db = await connectToDatabase();
  const entry = await db.db("downloads_db").collection("projects");
  var projects = (await entry.find().toArray()).map((a) => a.projectID);
  console.log("Got tracked projects list.");
  return res.status(200).json(projects);
};
