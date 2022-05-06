const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const category = sequelize.define('category', {
    category_id: {
      autoIncrement: true,
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });

  category.associate = function (models) {
    category.belongsToMany(models.Film, { as: 'Film', through: film_category, foreignKey: "category_id", otherKey: "film_id" });
    category.hasMany(models.FilmCategory, { as: "FilmCategory", foreignKey: "category_id" });
  }
  return category;
};
