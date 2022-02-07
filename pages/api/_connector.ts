import axios from "axios";
import { MongoClient } from "mongodb";

let cachedDb: MongoClient;
var MONGODB_URI;
var CF_ACCESSTOKEN;
var BASE_URL = "https://api.curseforge.com/";

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  if (!MONGODB_URI) {
    MONGODB_URI = process.env.MONGODB_URI;
    if (MONGODB_URI.includes("MONGODB_URI")) {
      MONGODB_URI = MONGODB_URI.split("MONGODB_URI=")[1].split('"')[1];
    }
  }
  const client = await MongoClient.connect(MONGODB_URI);
  cachedDb = client;
  return client;
}
/**
 * Returns a response object convert to text or json before using it.
 */
export async function connectToCfApi(endpoint, data?) {
  if (!CF_ACCESSTOKEN) {
    CF_ACCESSTOKEN = Buffer.from(
      process.env.CF_ACCESSTOKEN,
      "base64"
    ).toString();
    if (CF_ACCESSTOKEN.includes("CF_ACCESSTOKEN=")) {
      CF_ACCESSTOKEN = CF_ACCESSTOKEN.split("CF_ACCESSTOKEN=")[1].split('"')[1];
    }
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": CF_ACCESSTOKEN,
  };
  var res;
  await fetch(BASE_URL + endpoint, {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: headers,
  })
    .then((response) => (res = response))
    .catch((err) => console.error(err));
  return res;
}

export async function connectToApi(endpoint, body?) {
  var BASE_URL = "https://cf-download-monitor.vercel.app/api/";
  return await axios.get(BASE_URL + endpoint, {
    data: body,
  });
}
