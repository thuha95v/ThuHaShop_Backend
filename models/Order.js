module.exports = (sequelize, DataTypes) => {
  let Order = sequelize.define(
    "Order",
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
      customer_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pay_method: {
        type: DataTypes.ENUM,
        values: ["bank", "cash"],
      }
    },
    {
      tableName: "orders",
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
      },
    });
  };

  return Order;
};
