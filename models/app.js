"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const App = sequelize.define(
    "App",
    {
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      clientSecret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      redirectUri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      underscored: true,
      hooks: {
        beforeCreate: (app) => {
          app.clientSecret = bcrypt.hashSync(
            app.clientSecret,
            bcrypt.genSaltSync(10)
          );
        },
      },
    });

  App.associate = (models) => {
    models.App.hasMany(
      models.AuthorizationCode,
      {
        foreignKey: "clientId",
        sourceKey: "clientId",
      }
    );
  };

  return App;
};