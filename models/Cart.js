module.exports = (sequelize, DataTypes) => {
  let Cart = sequelize.define(
    "Cart",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "carts",
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.CartManage, {
      foreignKey: {
        name: "cart_id",
      },
    });

    Cart.belongsTo(models.Product, {
      as: "product",
      foreignKey: {
        name: "product_id",
      },
    });
  };

  return Cart;
};
