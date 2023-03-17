module.exports = (sequelize, DataTypes) => {
  let ProductOrder = sequelize.define(
    "ProductOrder",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
      }
    },
    {
      tableName: "product_order",
    }
  );

  ProductOrder.associate = (models) => {
    ProductOrder.belongsTo(models.Product, {
      foreignKey: {
        name: "product_id",
      },
    });

    ProductOrder.belongsTo(models.Order, {
      foreignKey: {
        name: "order_id",
      },
    });
  };

  return ProductOrder;
};
