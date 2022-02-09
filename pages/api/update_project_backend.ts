import { getHandledResponseCF } from "./_helper";
var FormData = require("form-data");

export default async (req, res) => {
  var CF_FILE_API_TOKEN = process.env.CF_FILE_API_TOKEN;
  if (CF_FILE_API_TOKEN.includes("CF_FILE_API_TOKEN")) {
    CF_FILE_API_TOKEN =
      CF_FILE_API_TOKEN.split("CF_FILE_API_TOKEN=")[1].split('"')[1];
  }
  var UPLOAD_API_BASE_URL = "https://minecraft.curseforge.com/";
  var fileApiHeader = {
    Accept: "application/json",
    "X-Api-Token": CF_FILE_API_TOKEN,
  };
  var message;
  var projectID = req.body.projectID;
  if (req.body !== "" && projectID !== undefined && projectID !== "") {
    var response = await getHandledResponseCF("v1/mods/" + projectID);
    if (response.data == undefined) {
      return res
        .status(424)
        .json({ error: "CF API couldn't be accessed " + projectID });
    }
    var fileID = response.data.latestFiles[0].id;
    console.info("Trying to update file " + fileID + " in project " + projectID);
    var changelog = await getHandledResponseCF("v1/mods/" + projectID + "/files/" + fileID + "/changelog");
    if (changelog.data == undefined) {
      return res.status(424).json({
        error: "CF API couldn't be accessed for project changelog" + projectID,
      });
    }
    var output = [];
    var changelogData = changelog.data;
    //If <br> at end trim else add <br>
    output.push({ OldChangeLog: changelogData });
    if (changelogData.substring(changelogData.length - 4) == "<br>") {
      changelogData = changelogData.split("<br>")[0];
    } else {
      changelogData += "<br>";
    }
    output.push({ NewChangeLog: changelogData });

    var url = UPLOAD_API_BASE_URL + "api/projects/" + projectID + "/update-file";
    var json = JSON.stringify({
      fileID: fileID,
      changelog: changelogData,
    });
    var formData = new FormData();
    formData.append("metadata", json);

    await fetch(url, {
      method: "POST",
      headers: fileApiHeader,
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => output.push(res));
    message = output;
    if ("errorCode" in message[2]) {
      console.log(message[2]["errorMessage"]);
      message =
        "StrikerRocker account doesn't have permission to manage files in the given project.";
      console.log(message);
      return res.status(500).json({ error: message });
    }
    console.info("Updated File : " + JSON.stringify(message));
    return res.status(200).json(message);
  } else {
    message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.status(400).json({ error: message });
  }
};
