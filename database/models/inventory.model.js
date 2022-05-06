const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const inventory = sequelize.define('inventory', {
    inventory_id: {
      autoIncrement: true,
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    film_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'film',
        key: 'film_id'
      }
    },
    store_id: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'store',
        key: 'store_id'
      }
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'inventory',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "inventory_id" },
        ]
      },
      {
        name: "idx_fk_film_id",
        using: "BTREE",
        fields: [
          { name: "film_id" },
        ]
      },
      {
        name: "idx_store_id_film_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
          { name: "film_id" },
        ]
      },
    ]
  });

  inventory.associate = function (models) {
    inventory.belongsTo(models.Film, { as: "Film", foreignKey: "film_id" });
    inventory.belongsTo(models.Store, { as: "Store", foreignKey: "store_id" });
    inventory.hasMany(models.Rental, { as: "Rental", foreignKey: "inventory_id" });
  }

  return inventory
};
