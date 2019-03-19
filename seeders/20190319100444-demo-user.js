"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Account", [
        {
          username: "vavassor",
          password: "password",
          email: "copernicus-@hotmail.com",
        },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Account", null, {});
  },
};