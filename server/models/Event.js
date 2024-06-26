module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        eventName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        eventType: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        eventDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        eventDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        eventTimeFrom: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        eventTimeTo: {
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
        eventStatus: {
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
        tableName: 'events'
    });

    return Event;
};