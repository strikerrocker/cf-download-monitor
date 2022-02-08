import { connectToDatabase } from "./_connector";
import { getHandledResponseCF } from "./_helper";

export default async (req, res) => {
  res.statusCode = 500;
  const client = await connectToDatabase();
  const projects = client.db("downloads_db").collection("projects");
  (await projects.find().toArray()).forEach(async (doc) => {
    var project_data = await getHandledResponseCF("v1/mods/" + doc.projectID);
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