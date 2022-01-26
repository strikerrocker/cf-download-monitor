import { connectToCfApi } from "./_connector";

export default async function handler(req, res) {
  var url = (req.url).substring(5);
  console.log("Proxying CF API Path : " + url + ", Data : " + JSON.stringify(req.body));
  var response = await connectToCfApi(url, req.body);
  var txt=await response.text()
  try{
    res.status(response.status).json(JSON.parse(txt))
  }catch(e){
    res.status(response.status).send({error:e.toString(),response:txt})
  }
}