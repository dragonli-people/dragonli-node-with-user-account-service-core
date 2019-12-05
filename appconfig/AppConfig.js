
const {AppInitRegistServiceHandler} = require('dragonli-node-with-java-service-core');
const {AppConfig} = require('dragonli-node-with-user-service-core');
const AccountManagerService = require('../moduleservices/AccountManagerService')


module.exports = class extends AppConfig {
    constructor(){
        super();
        this.addAppInitHandlers([
            new AppInitRegistServiceHandler('accountService' ,'InvokeService',AccountManagerService),
        ]);
        this.addControllerIocKeys(['accountService']);
    }
}