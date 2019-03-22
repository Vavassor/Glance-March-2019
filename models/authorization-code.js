"use strict";

module.exports = (sequelize, DataTypes) => {
  const AuthorizationCode = sequelize.define(
    "AuthorizationCode",
    {
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      redirectUri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
    });

  return AuthorizationCode;
};