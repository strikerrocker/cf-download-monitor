import { connectToApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const db = await connectToDatabase();
  const projects = await db.db("downloads_db").collection("projects");
  await projects.find().forEach(async (doc) => {
    var project_data = await connectToApi("project_data", {
      projectID: doc.projectID,
    });
    if (doc.name != project_data.data.name) {
      await projects.updateOne(
        { projectID: doc.projectID },
        {
          $set: {
            name: project_data.data.name,
          },
        }
      );
      console.log({
        projectID: doc.projectID,
        oldName: doc.name,
        newName: project_data.data.name,
      });
    }
  });
  return res.status(200).json("Updated project Names");
};