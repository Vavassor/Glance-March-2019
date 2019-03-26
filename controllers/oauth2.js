"use strict";

const models = require("../models");
const moment = require("moment");
const nanoid = require("nanoid");
const pkceHelper = require("../helpers/pkce.js");

const authorizationCodeExpirationSeconds = 60 * 10;

module.exports = {
  authorize: (clientId, redirectUri, done) => {
    models.App
      .findOne({
        where: {
          clientId: clientId,
        },
      })
      .then((app) => {
        if (!app || redirectUri !== app.redirectUri) {
          return done(null, false);
        }
        done(null, app, app.redirectUri);
      })
      .catch(error => done(error));
  },

  deserializeClient: (id, done) => {
    models.App
      .findOne({
        where: {
          id: id,
        },
      })
      .then((app) => {
        if (!app) {
          return done(null, false);
        }
        done(null, app);
      })
      .catch(error => done(error));
  },

  exchangeCode: (client, code, redirectUri, requestBody, done) => {
    models.AuthorizationCode
      .findOne({
        where: {
          value: code,
        },
      })
      .then((authorizationCode) => {
        if (!authorizationCode
            || authorizationCode.redirectUri !== redirectUri
            || authorizationCode.clientId !== client.clientId
            || moment().isAfter(authorizationCode.expiration)) {
          return done(null, false);
        }

        if (authorizationCode.codeChallenge
            && authorizationCode.codeChallengeMethod) {
          const codeVerifier = requestBody["code_verifier"];
          if (!codeVerifier) {
            return done(null, false);
          }

          const hash = pkceHelper.hash(codeVerifier);
          if (authorizationCode.codeChallenge !== hash) {
            return done(null, false);
          }
        }

        const originalValue = nanoid();
        
        models.AccessToken.create({
          value: originalValue,
          accountId: authorizationCode.accountId,
        })
        .then(token => authorizationCode.destroy())
        .then(affectedRows => done(null, originalValue, null, null))
        .catch(error => done(error));
      })
      .catch(error => done(error));
  },

  grantCode: (client, redirectUri, user, ares, request, done) => {
    models.AuthorizationCode
      .create({
        value: nanoid(),
        redirectUri: redirectUri,
        scope: ares.scope,
        codeChallenge: request.codeChallenge,
        codeChallengeMethod: request.codeChallengeMethod,
        clientId: client.clientId,
        accountId: user.id,
        expiration: moment()
          .add(authorizationCodeExpirationSeconds, "s")
          .toDate(),
      })
      .then(code => done(null, code.value))
      .catch(error => done(error));
  },

  serializeClient: (client, done) => {
    return done(null, client.id);
  },
};