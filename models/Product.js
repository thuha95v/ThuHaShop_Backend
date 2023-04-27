const slugify = require("slugify");

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
        validate: {
          notEmpty: {
            msg: "Tên sản phẩm không được trống"
          }
        },
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
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiry: {
        type: DataTypes.DATE,
        // allowNull: false,
      },
      tags: {
        type: DataTypes.JSON,
        // allowNull: false,
        defaultValue: ""
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

  Product.addHook("beforeValidate", (product) => {
    if (product.isNewRecord && product?.name) {
      product.slug = slugify(product.name, {
        lower: true,
        remove: undefined,
        locale: "vi",
        trim: true,
      });
    }
  });

  Product.addHook("beforeUpdate", (product) => {
    product.slug = slugify(product.name, {
      lower: true,
      remove: undefined,
      locale: "vi",
      trim: true,
    });
  })

  return Product;
};
