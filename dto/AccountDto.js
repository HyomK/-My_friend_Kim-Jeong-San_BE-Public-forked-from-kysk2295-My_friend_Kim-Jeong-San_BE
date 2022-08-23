module.exports = class AccountDto {
    bank;
    account;
    constructor(account) {
        this.id = account.id;
        this.bank = account.bank;
        this.account = account.account;
    }
};
