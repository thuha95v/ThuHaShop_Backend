const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  let Cart = sequelize.define(
    "Cart",
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
      },
      products: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      history: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["close", "open"],
        defaultValue: "close"
      },
    },
    {
      tableName: "carts",
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
      },
    });
  };

  return Cart;
};
