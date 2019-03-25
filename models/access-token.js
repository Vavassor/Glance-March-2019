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
      timestamps: false,
      underscored: true,
    });

  AccessToken.associate = (models) => {
    models.AccessToken.belongsTo(models.Account, {
      foreignKey: "accountId",
    });
  };

  return AccessToken;
};