const BaseUrl = () => {
  const NewURL = window.location.href;

  const urlObject = new URL(NewURL);
  const baseUrl = urlObject.origin;

  var URLS = "";

  if (urlObject.port) {
    if (baseUrl === "http://localhost:3000") {
      URLS = "http://localhost:8000/api/";
    } else {
      URLS = baseUrl.replace(/:\d+$/, ":8000");
      URLS = `${URLS}/api/`;
    }
  } else {
    URLS = `${baseUrl.replace(/:\d+$/, "")}/api/`;
  }

  // var URLS = "http://192.168.0.148:8000/api/";

  return URLS;
};

export default BaseUrl;
