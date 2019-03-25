"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      underscored: true,
      hooks: {
        beforeCreate: (account, options) => {
          account.password = bcrypt.hashSync(account.password, bcrypt.genSaltSync(10));
        },
      },
    });

  Account.associate = (models) => {
    models.Account.hasMany(
      models.AccessToken,
      {
        foreignKey: "accountId",
      }
    );
    models.Account.hasMany(
      models.AuthorizationCode,
      {
        foreignKey: "accountId",
      }
    );
  };
  
  return Account;
};