const Sequelize = require("../models/index");
const friendService = require("./friendService");

module.exports = {
    createAccount: async function (account, bank, userId, transaction) {
        const newAccount = await Sequelize.Account.create(
            {
                account: account,
                bank: bank,
                userId: userId,
            },
            {
                transaction: transaction,
            }
        );
        return newAccount;
    },

    findAccountById: async function (id) {
        return await Sequelize.Account.findOne({ where: { id: id } });
    },

    updateAccount: async function (id, bank, account, transaction) {
        return Sequelize.Account.update(
            { bank: bank, account, account },
            { where: { id: id } },
            { transaction }
        );
    },

    deleteAccount: async function (friendId, accountId, transaction) {
        const friend = await friendService.findFriendById(friendId);
        const account = friend.accounts;
        const newAccount = account.filter((v) => v != accountId);
        await friendService.updateAccount(friendId, newAccount, transaction);
        return Sequelize.Account.destroy(
            { where: { id: accountId } },
            { transaction }
        );
    },
};
