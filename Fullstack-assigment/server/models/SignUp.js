    module.exports = (sequelize, DataTypes) => {
        const SignUp = sequelize.define("SignUp", {
            Name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            MobileNumber: {
                type: DataTypes.INTEGER,
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
                type: DataTypes.STRING,
                allowNull: true // Assuming special requirements can be optional
            },
            eventCourseName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'signup'
        });

        return SignUp;
    };
