const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(email) {
          this.setDataValue("email", email.toLowerCase());
        },
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male", "female"],
        allowNull: false,
      },
      money: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "mod", "user"],
        defaultValue: "user"
      },
      isLock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: "users",
    }
  );

  User.associate = (models) => {
  };

  User.prototype.toJSON = function () {
    let attributes = Object.assign({}, this.get());
    delete attributes.password;
    return attributes;
  };

  User.addHook("beforeCreate", async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
  });

  return User;
};
