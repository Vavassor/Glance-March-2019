"use strict";

function randomString(length) {
  let text = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  for (let i = 0; i < length; i++) {
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
}

document
  .getElementById("connect")
  .addEventListener("click", (event) => {
    const link = event.currentTarget;
    const state = randomString(10);
    sessionStorage.setItem("state", state);
    link.href += "&state=" + state;
  });