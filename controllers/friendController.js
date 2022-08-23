const ResponseDto = require("../dto/ResponseDto");
const accountService = require("../services/acountService");
const { sequelize } = require("../models/index");
const friendService = require("../services/friendService");
const FriendDto = require("../dto/FriendDto");
const AccountDto = require("../dto/AccountDto");
module.exports = {
    createFriend: async function (req, res) {
        let transaction;
        try {
            const userId = req.query.userId;
            const imageURL = req.file ? req.file.location : null;

            if (!userId) {
                console.log(req.params);
                res.status(500).send(
                    new ResponseDto(500, "유저 아이디가 없습니다")
                );
            }
            transaction = await sequelize.transaction();
            const account = await accountService.createAccount(
                req.body.account,
                req.body.bank,
                req.body.userId,
                transaction
            );

            const friend = await friendService.createFriend(
                req,
                userId,
                account.id,
                imageURL,
                transaction
            );

            await transaction.commit();
            res.status(200).send(
                new ResponseDto(200, "계좌 따로 추가 생성 성공", {
                    friendId: friend.id,
                })
            );
        } catch (err) {
            await transaction?.rollback();
            console.log(err);
            res.status(500).send(
                new ResponseDto(500, "계좌 따로 추가 생성 실패")
            );
        }
    },
    getFriends: async function (req, res) {
        const userId = req.params.userId;
        try {
            const friends = await friendService.findFriendsByUserId(userId);
            console.log(friends);
            const list = [];

            for (i = 0; i < friends.length; i++) {
                const account = await accountService.findAccountById(
                    friends[i].accounts[0]
                );
                list.push(new FriendDto(friends[i], new AccountDto(account)));
            }
            res.status(200).send(
                new ResponseDto(200, "친구 리스트 조회 성공", list)
            );
        } catch (err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구 리스트 조회 실패"));
        }
    },
    getFriendInfo: async function (req, res) {
        const friendId = req.query.friendId;
        if (!friendId) {
            return res
                .status(500)
                .send(new ResponseDto(405, "친구 아이디가 필요합니다"));
        }
        try {
            const friend = await friendService.findFriendById(friendId);
            if (!friend) {
                return res
                    .status(500)
                    .send(new ResponseDto(400, "친구 조회 실패"));
            }

            const account = [];

            for (i = 0; i < friend.accounts.length; i++) {
                const a = await accountService.findAccountById(
                    friend.accounts[i]
                );
                if (a !== null) account.push(new AccountDto(a));
            }
            console.log(account);

            res.status(200).send(
                new ResponseDto(
                    200,
                    "친구 상세조회 성공",
                    new FriendDto(friend, account)
                )
            );
        } catch (err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구 상세조회 실패"));
        }
    },
    updateProfile: async function (req, res) {
        let transaction;
        try {
            const friendId = req.query.friendId;
            if (!friendId) {
                return res
                    .status(500)
                    .send(new ResponseDto(405, "친구 아이디가 필요합니다"));
            }
            const name = req.body.name;
            const profile = req.file.location;
            transaction = await sequelize.transaction();
            await friendService.updateProfile(
                friendId,
                name,
                profile,
                transaction
            );
            await transaction.commit();
            res.status(200).send(new ResponseDto(200, "친구 프로필 수정 성공"));
        } catch (err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구 프로필 수정 실패"));
        }
    },

    updateAccount: async function (req, res) {
        let transaction;
        try {
            const accountId = req.query.accountId;
            if (!accountId) {
                return res
                    .status(500)
                    .send(new ResponseDto(405, "쿼리 요청을 확인해주세요"));
            }
            transaction = await sequelize.transaction();
            await accountService.updateAccount(accountId, transaction);
            await transaction.commit();
            res.status(200).send(new ResponseDto(200, "친구 계좌 수정 성공"));
        } catch (err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구 계좌 수정 실패"));
        }
    },

    deleteAccount: async function (req, res) {
        let transaction;
        try {
            const accountId = req.query.accountId;
            const friendId = req.query.friendId;
            if (!accountId || !friendId) {
                return res
                    .status(500)
                    .send(new ResponseDto(405, "쿼리 요청을 확인해주세요"));
            }
            transaction = await sequelize.transaction();
            await accountService.deleteAccount(
                friendId,
                accountId,
                transaction
            );
            await transaction.commit();
            res.status(200).send(new ResponseDto(200, "친구 계좌 삭제 성공"));
        } catch (err) {
            console.log(err);
            res.status(500).send(new ResponseDto(500, "친구 계좌 삭제 실패"));
        }
    },
};
