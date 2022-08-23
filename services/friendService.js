const upload = require("../utils/upload");
const Sequelize = require("../models/index");

module.exports = {
    findFriendsByUserId: async function (userId) {
        return await Sequelize.Friend.findAll({
            where: { userId: userId },
        });
    },
    findFriendById: async function (friendId) {
        return await Sequelize.Friend.findOne({
            where: { id: friendId },
        });
    },
    createFriend: async function (req, userId, accountId, imgUrl, transaction) {
        const friend = await Sequelize.Friend.create(
            {
                name: req.body.name,
                profilePhoto: imgUrl ? imgUrl : null,
                UserId: userId,
                accounts: [accountId],
            },
            {
                transaction: transaction,
            }
        );

        return friend;
    },
    insertNewAccount: async function (friendId, account, transaction) {
        const friends = await this.findFriendById(friendId);

        const newAccount = friends.accounts;
        newAccount.push(account.id);
        await Sequelize.Friend.update(
            { accounts: newAccount },
            { where: { id: friendId } },
            { transaction }
        );
    },
    updateProfile: async function (friendId, name, imageUrl, transaction) {
        await Sequelize.Friend.update(
            { name: name, profilePhoto: imageUrl ? imageUrl : null },
            { where: { id: friendId } },
            { transaction }
        );
    },

    updateAccount: async function (friendId, account, transaction) {
        await Sequelize.Friend.update(
            { accounts: account },
            { where: { id: friendId } },
            { transaction }
        );
    },
};
