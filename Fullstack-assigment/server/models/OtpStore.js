module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define("OTP", {
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6), 
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'otps',
    timestamps: true,
    updatedAt: false,
  });

  return OTP;
};
