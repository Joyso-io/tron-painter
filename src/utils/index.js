const contractAddress = 'TWoeCAWoaXBYNdfyAh1231szB1bQVZd12o'

const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    }
};

export default utils;
