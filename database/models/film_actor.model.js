const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const film_actor = sequelize.define('film_actor', {
    actor_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'actor',
        key: 'actor_id'
      }
    },
    film_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'film',
        key: 'film_id'
      }
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'film_actor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "actor_id" },
          { name: "film_id" },
        ]
      },
      {
        name: "idx_fk_film_id",
        using: "BTREE",
        fields: [
          { name: "film_id" },
        ]
      },
    ]
  });

  film_actor.associate = function (models) {
    film_actor.belongsTo(models.Actor, { as: "Actor", foreignKey: "actor_id" });
    film_actor.belongsTo(models.Film, { as: "Film", foreignKey: "film_id" });
    
  }

  return film_actor;
};
