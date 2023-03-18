const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  let Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        unique: {
          args: "name",
          msg: "Thể loại đã tồn tại",
        },
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "categories",
    }
  );

  Category.associate = (models) => {};

  // Category.addHook("beforeValidate", (category) => {
  //   if (category.isNewRecord) {
  //     category.slug = slugify(category.name, {
  //       lower: true,
  //       remove: undefined,
  //       locale: "vi",
  //       trim: true,
  //     });
  //   }
  // });

  Category.addHook("beforeUpdate", (category) => {
    console.log("hello");
    category.slug = slugify(category.name, {
      lower: true,
      remove: undefined,
      locale: "vi",
      trim: true,
    });
  })

  return Category;
};
