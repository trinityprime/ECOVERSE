module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        incidentType: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'reports'
    });

    // Report.associate = (models) => {
    //     Report.belongsTo(models.User, {
    //         foreignKey: "userId",
    //         as: 'user'
    //     });
    // };

    return Report;
}
