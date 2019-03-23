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
      scope: {
        type: DataTypes.STRING,
      },
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
    });

  return AuthorizationCode;
};