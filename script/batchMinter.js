const { ethers } = require('ethers');

const providerUrl = 'RPC节点地址';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const privateKey = '私钥';
const wallet = new ethers.Wallet(privateKey, provider);
const recipientAddress = '转移的地址（自转）'; 

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// 获取当前账户的 nonce
async function getCurrentNonce(wallet) {
    try {
      const nonce = await wallet.getTransactionCount("pending");
      console.log("Nonce:", nonce);
      return nonce;
    } catch (error) {
      console.error("Error fetching nonce:", error.message);
      throw error;
    }
}
//开打
async function sendData() {
    const data = 'data 16进制数据';

    let nonce = await getCurrentNonce(wallet);
    let amount = 100;   //循环次数
    for (let i = 0; i < amount; i++) {
        try {
            let j = i % 10;
            if(j == 0) {
                sleep(5000);
                nonce = await getCurrentNonce(wallet);
            }

            let currentGasPrice = await provider.getGasPrice();
            const tx = await wallet.sendTransaction({
                to: recipientAddress,
                value: 0, 
                data: data,
                gasPrice: currentGasPrice,
                gasLimit: 25000,
                chainId: 250,
                nonce: nonce + j
            });
            console.log(`第 ${nonce + j} 次数据交易哈希:`, tx.hash);
        } catch (error) {
            i--;
            console.error('发生异常:', error.message);
        }
    }
}

sendData();