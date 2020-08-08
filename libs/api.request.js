import HttpRequest from "./ajax";

const baseUrl = "http://localhost:3000";
const timeout = 3000;
const baseHeaders = {};
const baseData = {};
const httpRequest = new HttpRequest(baseUrl, timeout);

export default (options) => {
  if (options.method === "post") {
    options.body = options.data
      ? Object.assign(baseData, options.data)
      : baseData;
    delete options.data;
  }
  options.headers = Object.assign(baseHeaders, options.headers);
  return httpRequest.request(options);
};
