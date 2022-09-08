module.exports = (sequelize, Sequelize) => {
    const License = sequelize.define("license", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
        },
        validityDays: {
            type: Sequelize.INTEGER,
            defaultValue: 30,
        }
    });
    return License;
};