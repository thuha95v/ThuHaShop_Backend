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
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      pay_method: {
        type: DataTypes.ENUM,
        values: ["bank", "cash"],
        allowNull: false,
        defaultValue: "cash"
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
