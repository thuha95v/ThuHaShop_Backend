const slugify = require("slugify");

module.exports = (sequelize, DataTypes) => {
  let Post = sequelize.define(
    "Post",
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSON,
      }
    },
    {
      tableName: "posts",
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: "user_id",
      },
    });
  };

  Post.addHook("beforeValidate", (post) => {
    if (post.isNewRecord) {
      post.slug = slugify(post.title, {
        lower: true,
        remove: undefined,
        locale: "vi",
        trim: true,
      });
    }
  });

  Post.addHook("beforeUpdate", (post) => {
    post.slug = slugify(post.title, {
      lower: true,
      remove: undefined,
      locale: "vi",
      trim: true,
    });
  })
  return Post;
};
