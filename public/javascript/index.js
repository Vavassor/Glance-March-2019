"use strict";

document
  .getElementById("login")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      return false;
    }

    console.log("success");
  });