"use strict";

function generateCodeVerifier() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let text = "";
  for (let i = 0; i < 32; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return stringToBase64Url(text);
}

function randomString(length) {
  let text = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  for (let i = 0; i < length; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
}

function arrayBufferToBase64Url(arrayBuffer) {
  const buffer = new Uint8Array(arrayBuffer);
  const base64 = base64js.fromByteArray(buffer)
  return base64
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function stringToBase64Url(string) {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(string);
  return arrayBufferToBase64Url(buffer);
}

document
  .getElementById("connect")
  .addEventListener("click", (event) => {
    event.preventDefault();

    const link = event.currentTarget;

    const codeVerifier = generateCodeVerifier();
    const state = randomString(10);
    sessionStorage.setItem("code_verifier", codeVerifier);
    sessionStorage.setItem("state", state);

    const encoder = new TextEncoder("utf-8");
    const codeVerifierUtf8 = encoder.encode(codeVerifier);

    crypto.subtle
      .digest("SHA-256", codeVerifierUtf8)
      .then((digest) => {
        const codeChallenge = arrayBufferToBase64Url(digest);
        const url = new URL(link.href);
        url.searchParams.append("state", state);
        url.searchParams.append("code_challenge", codeChallenge);
        url.searchParams.append("code_challenge_method", "S256");
        window.location = url.href;
      });
  });