module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.Report, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
    };

    return User;
};