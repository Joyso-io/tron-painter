const contractAddress = 'TLk3LeY7qz19z3HsHcaQAbeYsxtqoZRbLx'
const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    }
};

export default utils;
