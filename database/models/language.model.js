const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const language = sequelize.define('language', {
    language_id: {
      autoIncrement: true,
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.CHAR(20),
      allowNull: false
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'language',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
    ]
  });

  language.associate = function (models) {
    language.hasMany(models.Film, { as: "Film", foreignKey: "language_id" })
    language.hasMany(models.Film, { as: "Film", foreignKey: "original_language_id" })
  }
  return language
};
