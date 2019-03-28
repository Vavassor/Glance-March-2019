"use strict";

function urlEncode(object) {
  return Object.keys(object)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
    .join("&");
}

function ajaxCall(options) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    let queryUrl = options.url;
    if (options.method === "GET" && options.data) {
      queryUrl += "?" + urlEncode(options.data);
    }

    if (options.username && options.password) {
      request.open(options.method, queryUrl, true, options.username, options.password);
      request.withCredentials = true;
    } else {
      request.open(options.method, queryUrl);
    }

    request.onload = () => {
      if (request.status === 200) {
        return resolve(request.response);
      } else {
        return reject(Error(request.statusText));
      }
    };

    request.onerror = (error) => {
      return reject(Error("Network Error: " + error));
    };

    const hasBody = (method) => {
      return method === "PATCH"
        || method === "POST"
        || method === "PUT";
    };

    let body = null;
    if (hasBody(options.method) && options.data) {
      let bodyType;
      switch (bodyType) {
        default:
        case "POST":
          bodyType = "url-encoded";
          break;

        case "PATCH":
        case "PUT":
          bodyType = "json";
          break;
      }

      switch (bodyType) {
        case "json":
          request.setRequestHeader("Content-Type", "application/json");
          body = JSON.stringify(options.data);
          break;

        case "url-encoded":
          request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          body = urlEncode(options.data);
          break;
      }
    }

    for (const key in options.headers) {
      request.setRequestHeader(key, options.headers[key]);
    }

    request.send(body);
  });
}


function loadSomething() {
  const parameters = new URLSearchParams(window.location.search);

  const code = parameters.get("code");
  if (!code) {
    return;
  }

  const state = parameters.get("state");
  if (!state || state !== sessionStorage.getItem("state")) {
    return;
  }
  
  ajaxCall({
    url: "/oauth2/token",
    method: "POST",
    data: {
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": "/",
      "client_id": "c7d9e3d7-53fc-5daf-acdf-5bc8334378a7",
      "code_verifier": sessionStorage.getItem("code_verifier"),
    },
  })
  .then((responseJson) => {
    const response = JSON.parse(responseJson);
    ajaxCall({
      method: "GET",
      url: "/api/account",
      headers: {
        "Authorization": "Bearer " + response["access_token"],
      },
    })
    .then((responseJson) => {
      const response = JSON.parse(responseJson);
      const accessToken = document.getElementById("email");
      accessToken.innerText = response["email"];
    })
    .catch((error) => {
      console.error(error);
    });
  })
  .catch((error) => {
    console.log(error);
  });
}


loadSomething();