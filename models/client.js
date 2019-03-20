"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientSecret: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          hashesMatch: function(clientSecret) {
            return bcrypt.compareSync(clientSecret, this.clientSecret);
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      redirectUri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "clients",
      underscored: true,
      hooks: {
        beforeValidate: (client) => {
          client.clientSecret = bcrypt.hashSync(
            client.clientSecret,
            bcrypt.genSaltSync(10),
            null);
        },
      },
    });

  return Client;
};