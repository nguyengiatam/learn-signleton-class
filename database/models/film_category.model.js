const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const film_category = sequelize.define('film_category', {
    film_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'film',
        key: 'film_id'
      }
    },
    category_id: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'category',
        key: 'category_id'
      }
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'film_category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "film_id" },
          { name: "category_id" },
        ]
      },
      {
        name: "fk_film_category_category",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });

  film_category.associate = function (models) {
    film_category.belongsTo(models.Category, { as: "Category", foreignKey: "category_id" });
    film_category.belongsTo(models.Film, { as: "Film", foreignKey: "film_id" });
  }

  return film_category
};
