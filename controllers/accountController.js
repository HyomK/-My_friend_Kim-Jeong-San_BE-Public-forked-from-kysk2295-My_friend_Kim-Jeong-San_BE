const ResponseDto = require("../dto/ResponseDto");
const accountService = require("../services/acountService");
const { sequelize } = require("../models/index");
const friendService = require("../services/friendService");
const FriendDto = require("../dto/FriendDto");
const AccountDto = require("../dto/AccountDto");
module.exports = {
    addAccount: async function (req, res) {
        let transaction;
        try {
            const friendId = req.query.friendId;
            const userId = req.query.userId;
            if (!userId || !friendId) {
                return res
                    .status(500)
                    .send(new ResponseDto(500, "요청 쿼리를 확인해주세요"));
            }

            transaction = await sequelize.transaction();
            const account = await accountService.createAccount(
                req.body.account,
                req.body.bank,
                req.body.userId,
                transaction
            );

            await friendService.insertNewAccount(
                friendId,
                account,
                transaction
            );
            await transaction.commit();

            res.status(200).send(new ResponseDto(200, "계좌 추가 성공"));
        } catch (err) {
            await transaction?.rollback();
            console.log(err);
            res.status(500).send(new ResponseDto(500, "계좌 추가 실패"));
        }
    },
};
