import { connectToDatabase } from "./_connector";
import { addDwnldEntry, getHandledResponseCF } from "./_helper";

export default async (req, res) => {
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    const client = await connectToDatabase();
    var response = await getHandledResponseCF("v1/mods/" + req.body.projectID);
    addDwnldEntry(client, {
      id: req.body.projectID,
      name: response.data.name,
      downloads: response.data.downloadCount,
      dateTime: response.data.dateModified,
    });
    var message = {
      project_name: response.data.name,
      download_count: response.data.downloadCount,
    };
    console.log(message);
    return res.status(200).json(message);
  }
};