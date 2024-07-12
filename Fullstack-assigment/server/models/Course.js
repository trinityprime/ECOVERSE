module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
        courseName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        courseType: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        courseDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        courseStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        courseEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        courseTimeFrom: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        courseTimeTo: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        organizerDetails: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        termsAndConditions: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        courseStatus: {
            type: DataTypes.STRING(20), // Adjust length as needed
            allowNull: false,
            validate: {
                isIn: [['Ongoing', 'Scheduled', 'Cancelled', 'Completed', 'Postponed']]
            }
        },
        imageFile: {
            type: DataTypes.STRING(20)
        }
    }, {
        tableName: 'courses'
    });
    return Course;
};