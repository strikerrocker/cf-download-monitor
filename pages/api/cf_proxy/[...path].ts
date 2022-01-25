import { connectToCfApi } from "../_connector";

export default async function handler(req, res) {
  const { path } = req.query;
  var correctPath = path.join("/");
  console.log("Proxying CF API Path : " + correctPath + ", Data : " + JSON.stringify(req.body));
  var response = await connectToCfApi(correctPath, req.body);
  res.json(response.data);
}