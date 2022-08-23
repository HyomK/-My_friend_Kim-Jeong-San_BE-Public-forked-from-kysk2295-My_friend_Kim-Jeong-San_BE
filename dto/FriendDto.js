module.exports = class FriendDto {
    friendId;
    name;
    profile;
    accounts;
    isMembership;
    constructor(friend, accountList) {
        this.friendId = friend.dataValues.id;
        this.name = friend.dataValues.name;
        this.profile = friend.dataValues.profilePhoto;
        this.accounts = accountList;
        this.isMembership = friend.friendUserId !== null;
    }
};
