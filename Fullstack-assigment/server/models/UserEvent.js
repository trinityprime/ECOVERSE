module.exports = (sequelize, DataTypes) => {
    const UserEvent = sequelize.define("UserEvent", {
        eventName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        eventPax: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eventAddress: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        eventDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        eventDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        }
        
    }, {
        tableName: 'userEvent'
    });
    return UserEvent;
}