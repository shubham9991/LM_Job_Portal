// backend/models/Setting.js
// Simple key-value settings table for storing configuration like subSkill mark limit
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'Settings'
  });

  return Setting;
};
