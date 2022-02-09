import { connectToDatabase } from "./_connector";
import { addDwnldEntry, getHandledResponseCF } from "./_helper";

export default async (req, res) => {
  var projectID = req.body.projectID;
  if (req.body !== "" && projectID !== undefined && projectID !== "") {
    const client = await connectToDatabase();
    var response = await getHandledResponseCF("v1/mods/" + projectID);
    if (response.data == undefined) {
      return res
        .status(424)
        .json({
          error: "CF API couldn't be accessed for project " + projectID,
        });
    }
    addDwnldEntry(client, {
      id: parseInt(projectID),
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