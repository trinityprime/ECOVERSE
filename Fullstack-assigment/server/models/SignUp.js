module.exports = (sequelize, DataTypes) => {
    const SignUp = sequelize.define("SignUp", {
        Name: {
            type: DataTypes.STRING(100), // Matching the length of eventName in UserEvent
            allowNull: false
        },
        MobileNumber: {
            type: DataTypes.INTEGER, // Use STRING to accommodate different number formats
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        numberOfPax: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        specialRequirements: {
            type: DataTypes.TEXT, // Using TEXT to be more flexible with longer text
            allowNull: true // Optional field
        },
        eventCourseName: {
            type: DataTypes.STRING(100), // Matching the length of eventAddress in UserEvent
            allowNull: false
        }
    }, {
        tableName: 'signups' // Ensure the table name is consistent
    });

    SignUp.associate = (models) => {
        SignUp.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return SignUp;
};
