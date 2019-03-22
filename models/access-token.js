"use strict";

module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define(
    "AccessToken",
    {
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      underscored: true,
    });

  return AccessToken;
};