const Sequelize = require("sequelize");

module.exports = class Account extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                userId: {
                    type: Sequelize.STRING(300),
                    allowNull: true,
                },
                bank: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                account: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Account",
                tableName: "accounts",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {}
};
