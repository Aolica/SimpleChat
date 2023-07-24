import { resolve } from "path";

function APICall(path :string, req :object,callback :Function) {
  const url = "https://45itgrh7r9.execute-api.ap-northeast-1.amazonaws.com" || process.env.REACT_APP_API_URL;
  const request = Object.assign({ 
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': `${url}`},
    mode: "cors" as RequestMode
  }, req);
  fetch(url+path, request)
  .then((res) => {
    if(res.ok){
      return res.json();
    }else{
      throw new Error("Network response was not ok.");
    }}
  )
  .then((result) => {
    callback(result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  return;
}

export function getAPICall(path :string, callback :Function) {
  const request = {
    method: "GET",
  };
  APICall(path, request, callback);
}

export function postAPICall(path :string, body :object, callback :Function) {
  const request = {
    method: "POST",
    body: JSON.stringify(body)
  };
  APICall(path, request, callback);
}