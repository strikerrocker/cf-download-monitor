import { connectToCfApi, connectToDatabase } from "./_connector";

export default async (req, res) => {
  res.statusCode = 500;
  const db = await connectToDatabase();
  const projects = db.db("downloads_db").collection("projects");
  projects.find().forEach(async (doc) => {
    var project_data = await (await connectToCfApi("v1/mods/" + doc.projectID)).json();
    if (doc.name != project_data.data.name) {
      await projects.updateOne(
        { projectID: doc.projectID },
        {
          $set: {
            name: project_data.data.name,
          },
        }
      );
      console.log("Updated Project Names : " + {
        projectID: doc.projectID,
        oldName: doc.name,
        newName: project_data.data.name,
      });
    }
  });
  return res.status(200).json("Updated project Names");
};