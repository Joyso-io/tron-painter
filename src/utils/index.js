const contractAddress = 'TBw7xYLPTiSjmVvK3eZoi9zBJLdvpL3Yoz'

const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    }
};

export default utils;
