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
        validate: {
          notNull: {
            msg: "Địa chỉ không được trống"
          }
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "SĐT không được trống"
          }
        },
      },
      pay_method: {
        type: DataTypes.ENUM,
        values: ["bank", "cash"],
        allowNull: false,
        defaultValue: "cash"
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["WAITING", "SUCCESS", "FAIL"],
        defaultValue: "WAITING"
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

    Order.hasMany(models.ProductOrder, {
      as: "products",
      foreignKey: {
        name: "order_id",
      },
    });
  };

  return Order;
};
