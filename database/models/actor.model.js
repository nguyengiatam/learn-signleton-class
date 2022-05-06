const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const actor = sequelize.define('actor', {
    actor_id: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'actor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "actor_id" },
        ]
      },
      {
        name: "idx_actor_last_name",
        using: "BTREE",
        fields: [
          { name: "last_name" },
        ]
      },
    ]
  });

  actor.associate = function(models){
    actor.belongsToMany(models.Film, { as: 'Film', through: film_actor, foreignKey: "actor_id", otherKey: "film_id" });
    actor.hasMany(models.film_actor, { as: "FilmActor", foreignKey: "actor_id" });
  }

  return actor;
};
