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
  event.preventDefault();

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

  console.log("success");
});