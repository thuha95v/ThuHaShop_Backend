module.exports = (sequelize, DataTypes) => {
  let Affiliate = sequelize.define(
    "Affiliate",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      campaign_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      revenue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "affiliates",
    }
  );

  Affiliate.associate = (models) => {
    Affiliate.belongsTo(models.Campaign, {
      foreignKey: {
        name: "campaign_id",
      },
    });
  };

  return Affiliate;
};
