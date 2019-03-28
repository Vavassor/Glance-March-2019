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
      codeChallenge: {
        type: DataTypes.STRING,
      },
      codeChallengeMethod: {
        type: DataTypes.ENUM,
        values: ["plain", "S256"],
      },
      expiration: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
    });

  AuthorizationCode.associate = (models) => {
    models.AuthorizationCode.belongsTo(
      models.App,
      {
        foreignKey: "clientId",
        targetKey: "clientId",
      }
    );
    models.AuthorizationCode.belongsTo(
      models.Account,
      {
        foreignKey: "accountId",
      }
    );
  };

  return AuthorizationCode;
};