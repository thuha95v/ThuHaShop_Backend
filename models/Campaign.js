module.exports = (sequelize, DataTypes) => {
  let Campaign = sequelize.define(
    "Campaign",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["waiting", "accept", "reject", "lock"],
        defaultValue: "waiting",
      },
    },
    {
      tableName: "campaigns",
    }
  );

  Campaign.associate = (models) => {
    Campaign.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
      },
    });

    Campaign.belongsTo(models.Product, {
      foreignKey: {
        name: "product_id",
      },
    });
  };

  return Campaign;
};
