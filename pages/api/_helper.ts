import { connectToCfApi, connectToDatabase } from "./_connector";

export async function getTrackedProjects() {
  const client = await connectToDatabase();
  const entry = client.db("downloads_db").collection("projects");
  var projects = (await entry.find().toArray()).map((a) => a.projectID);
  return projects;
}

export async function getHandledResponseCF(url, body?) {
  var response = await connectToCfApi(url, body);
  var txt = await response.text();
  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt;
  }
}

export function addDwnldEntry(client,id, name, downloads, dateTime) {
  client.db("downloads_db").collection("projects_downloads").insertOne({
    id: id,
    name: name,
    downloads: downloads,
    dateTime: dateTime,
  });
}