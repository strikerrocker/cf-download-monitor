import { connectToApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const db = await connectToDatabase();
  const entry = await db.db("downloads_db").collection("projects");
  var stream = await entry.find().stream();
  await stream.on("data", async (doc) => {
    var res = await connectToApi("project_data", { projectID: doc.projectID });
    entry.updateOne(
      { projectID: doc.projectID },
      {
        $set: {
          name: res.data.name,
        },
      }
    );
  });
  res.statusCode=200;
  return res.json("Updated project names");
};
