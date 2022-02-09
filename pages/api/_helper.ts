import { MongoClient } from "mongodb";
import { connectToCfApi, connectToDatabase } from "./_connector";

const downloadsCollection = "projects_downloads";

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

export function addDwnldEntry(client,document) {
  client.db("downloads_db").collection(downloadsCollection).insertOne(document,(e,t)=>{
    if(e)console.log(e)
  });
}

export function addDownloadEntries(client: MongoClient, array) {
  client
    .db("downloads_db")
    .collection(downloadsCollection)
    .insertMany(array);
}