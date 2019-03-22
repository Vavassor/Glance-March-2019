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
        validate: {
          hashesMatch: function(password) {
            return bcrypt.compareSync(password, this.password);
          },
        },
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
        beforeCreate: (account) => {
          account.password = bcrypt.hashSync(
            account.password,
            bcrypt.genSaltSync(10),
            null);
        },
      },
    });
  
  return Account;
};