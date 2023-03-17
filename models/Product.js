module.exports = (sequelize, DataTypes) => {
  let Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_desc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      long_desc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provide_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quanlity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "products",
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: {
        name: "category_id",
      },
    });
  };

  return Product;
};
