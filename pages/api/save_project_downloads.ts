import { connectToCfApi, connectToDatabase } from "./_connector";
import { addToDB } from "./save_tracked_projects_downloads";

export default async (req, res) => {
  const db = await connectToDatabase();
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var response = await (await connectToCfApi("v1/mods/" + req.body.projectID)).json();
    await addToDB(
      db,
      req.body.projectID,
      response.data.name,
      response.data.downloadCount,
      response.data.dateModified
    );
    var message = {
      project_name: response.data.name,
      download_count: response.data.downloadCount,
    };
    console.log(message);
    return res.status(200).json(message);
  }
};