module.exports = (sequelize, DataTypes) => {
  let CartManage = sequelize.define(
    "CartManage",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
      },
      history: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: ""
      },
      status: {
        type: DataTypes.ENUM,
        values: ["close", "open"],
        defaultValue: "close"
      },
    },
    {
      tableName: "cart_manage",
    }
  );

  CartManage.associate = (models) => {
    CartManage.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
      },
    });

    CartManage.hasOne(models.Cart, {
      foreignKey: "cart_id"
    })
  };

  return CartManage;
};
