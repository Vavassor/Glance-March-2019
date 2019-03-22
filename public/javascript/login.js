"use strict";

function hideFeedback(id) {
  const element = document.getElementById(id);
  element.classList.remove("show-feedback");
}

function removeClassFromDescendants(element, className) {
  const elements = element.getElementsByClassName(className);
  for (const element of elements) {
    element.classList.remove(className);
  }
}

function showFeedback(id) {
  const element = document.getElementById(id);
  element.classList.add("show-feedback");
}

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

    request.send(body);
  });
}


const form = document.getElementById("login");

const controls = form.getElementsByClassName("form-control");
for (const control of controls) {
  control.addEventListener("input", (event) => {
    const element = event.currentTarget;
    if (!element.checkValidity()) {
      showFeedback(control.dataset.invalidFeedback);
    } else {
      hideFeedback(control.dataset.invalidFeedback);
    }
  });
}

form.addEventListener("submit", (event) => {
  const form = event.currentTarget;
  const isValid = form.checkValidity();
  removeClassFromDescendants(form, "show-feedback");
  form.classList.add("was-validated");

  if (!isValid) {
    showFeedback("login-feedback");

    const controls = form.getElementsByClassName("form-control");
    for (const control of controls) {
      if (!control.checkValidity()) {
        showFeedback(control.dataset.invalidFeedback);
      }
    }

    return false;
  }

  // const parameters = {
  //   "response_type": "code",
  //   "client_id": "c7d9e3d7-53fc-5daf-acdf-5bc8334378a7",
  //   "redirect_uri": "/",
  // };

  return true;
});