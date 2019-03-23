"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define(
    "AccessToken",
    {
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          hashesMatch: function(value) {
            return bcrypt.compareSync(value, this.value);
          },
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
      hooks: {
        beforeCreate: (accessToken) => {
          accessToken = bcrypt.hashSync(
            accessToken.value,
            bcrypt.genSaltSync(10),
            null);
        },
      },
    });

  return AccessToken;
};