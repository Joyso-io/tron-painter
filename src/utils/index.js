// const contractAddress = 'TQU7DiZQ87zCPr4Ds32VXsrcv7UrPui8QC'
const contractAddress = 'TXQ1GQZCwzfvbdDMpGy4EbYqymFT91hmuy'
const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    }
};

export default utils;
