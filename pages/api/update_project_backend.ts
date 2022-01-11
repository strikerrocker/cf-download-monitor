import { connectToApi, connectToCfApi } from "./_connector";
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
  if (
    req.body !== "" &&
    req.body.projectID !== undefined &&
    req.body.projectID !== ""
  ) {
    var response = await connectToApi("project_data", {
      projectID: req.body.projectID,
    });
    var data = response.data;
    var file = data.latestFiles[0];

    var fileID = file.id;
    console.info(
      "Trying to update file " + fileID + " in project " + req.body.projectID
    );
    var changelog = await connectToCfApi(
      "v1/mods/" + req.body.projectID + "/files/" + fileID + "/changelog"
    );
    var output = [];
    var changelogData = changelog.data.data;

    //If <hr> at end trim else add <hr>
    output.push({ OldChangeLog: changelogData });
    if (changelogData.substring(changelogData.length - 4) == "<br>") {
      changelogData = changelogData.split("<br>")[0];
    } else {
      changelogData += "<br>";
    }
    output.push({ NewChangeLog: changelogData });

    var url =
      UPLOAD_API_BASE_URL +
      "api/projects/" +
      req.body.projectID +
      "/update-file";
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
      res.statusCode = 500;
      return res.json({ error: message });
    }
    console.info("Updated File : " + JSON.stringify(message));
    res.statusCode = 200;
    return res.json(message);
  } else {
    res.statusCode = 400;
    message =
      "Invalid data. Expected projectID but got " + JSON.stringify(req.body);
    console.log(message);
    return res.json({ error: message });
  }
};