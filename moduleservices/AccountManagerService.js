const {sleep} = require('dragonli-node-tools');

module.exports = {
    defaultInterfaceName: 'org.dragonli.service.modules.account.interfaces.AccountManagerService',

    withdrawal: (userId, reflexId, currency, amountStr) => ({
        parasType: ['long', 'string', 'string', 'string(BigDecimal)'],
        resultType: 'object'
    }),
    paymentStatus: (orderId) => ({parasType: ['string'], resultType: 'object'}),
    adjustmentStatus: (orderId) => ({parasType: ['string'], resultType: 'object'}),
    payment: (userId, reflexId, target, amountStr, currency, orderId, remark, readOnly) =>
        ({
            parasType: ['long', 'string', 'string', 'string(BigDecimal)', 'string', 'string', 'string', 'boolean'],
            resultType: 'object'
        }),
    accountWithdrawal: (userId, amountStr, currency, orderId, address, addressExtend) =>
        ({parasType: ['long', 'string', 'string', 'string', 'string', 'object'], resultType: 'object'}),
    getUserAccount: (userId, reflexId, currency) => ({parasType: ['long', 'string', 'string'], resultType: 'object'}),
    userAccountList: (userId) => ({parasType: ['long'], resultType: 'object'}),
    executeWithdrawal: (id, ok) => ({parasType: ['long', 'boolean'], resultType: 'object'}),
    accountAdjustment: (orderId, userId, reflexId, currency, amountStr, remark) =>
        ({parasType: ['string', 'long', 'string', 'string', 'string(BigDecimal)', 'string'], resultType: 'string'}),
    fixBusiness: (id) => ({parasType: ['long'], resultType: 'boolean'}),
    closeBusiness: (id) => ({parasType: ['long'], resultType: 'boolean'}),
    waitPayment: () => (async function (orderId, waitCount = 64, interval = 32) {
        for (var i = 0; i < waitCount; i++) {
            await sleep(interval);
            var {status} = await this.paymentStatus(orderId);
            if (status === 'SUCCESS' || status === 'FAILED') return status
        }
        return null;
    }),
    paymentAndWaitResult: () => (async function (userId, reflexId, target, amountStr,
                                                 currency, orderId, remark, readOnly=false, waitCount = 64, interval = 32) {
        await this.payment(userId, reflexId, target, amountStr,currency, orderId, remark,readOnly);
        return await this.waitPayment(orderId,waitCount,interval);
    }),
    waitAdjustment: () => (async function (orderId, waitCount = 64, interval = 32) {
        for (var i = 0; i < waitCount; i++) {
            await sleep(interval);
            var {status} = await this.adjustmentStatus(orderId);
            if (status === 'SUCCESS' || status === 'FAILED') return status
        }
        return null;
    }),
    adjustmentAndWaitResult: () => (async function (orderId, userId, reflexId, currency,
                                                    amountStr, remark, readOnly=false, waitCount = 64, interval = 32) {
        await this.accountAdjustment(orderId, userId, reflexId, currency, amountStr, remark);
        return await this.waitAdjustment(orderId,waitCount,interval);
    }),
}

