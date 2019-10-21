module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'administrator',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      { after: 'provider' }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'administrator');
  },
};
