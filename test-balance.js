const { Connection, PublicKey } = require('@solana/web3.js');

async function checkBalance() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    console.log("Connection Established");

    const walletAddress = new PublicKey('3xsMLdAWXGSRUExnktqsW1UaNurq19ceQGUY5NeWrsk6');
    const mintAddress = new PublicKey('E23qZatCvTpnxbwYuKQ7ZeGNwdiPe2cKzdojPjDpump');

    console.log(`Searching for Mint: ${mintAddress.toString()}`);

    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            walletAddress,
            { mint: mintAddress }
        );

        console.log(`Found Accounts: ${tokenAccounts.value.length}`);

        if (tokenAccounts.value.length > 0) {
            const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
            const uiAmount = accountInfo.tokenAmount.uiAmount;
            console.log(`Balance: ${uiAmount}`);
        } else {
            console.log("Balance: 0 (No accounts found)");
        }

    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

checkBalance();
