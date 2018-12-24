const contractAddress = 'TXwdhtsuqQ4Un2bEPTTBXgw2KFYZGoZYKD'

const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    }
};

export default utils;
