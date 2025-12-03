const { Connection, PublicKey } = require('@solana/web3.js');

const TOKEN_ADDRESS = 'E23qZatCvTpnxbwYuKQ7ZeGNwdiPe2cKzdojPjDpump';
const TREASURY_WALLET_ADDRESS = '3xsMLdAWXGSRUExnktqsW1UaNurq19ceQGUY5NeWrsk6';
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

async function checkBalance() {
    try {
        const connection = new Connection(SOLANA_RPC_URL);
        const treasuryPublicKey = new PublicKey(TREASURY_WALLET_ADDRESS);
        const tokenMintPublicKey = new PublicKey(TOKEN_ADDRESS);

        console.log("Fetching accounts...");
        const accounts = await connection.getParsedTokenAccountsByOwner(
            treasuryPublicKey,
            { mint: tokenMintPublicKey }
        );

        console.log('Found accounts:', accounts.value.length);

        if (accounts.value.length > 0) {
            const balance = accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            console.log('Balance:', balance);
        } else {
            console.log('No accounts found for this mint.');
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

checkBalance();
