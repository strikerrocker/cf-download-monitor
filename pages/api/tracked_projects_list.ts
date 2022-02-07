import { connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const client = await connectToDatabase();
  const entry = await client.db("downloads_db").collection("projects");
  var projects = (await entry.find().toArray()).map((b) => {
    delete b._id;
    return b;
  });
  console.log("Got tracked projects list with names.");
  return res.status(200).json(projects);
};