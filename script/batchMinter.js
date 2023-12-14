const { ethers } = require('ethers');

const providerUrl = 'RPC节点';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const privateKey = '私钥';
const wallet = new ethers.Wallet(privateKey, provider);
const targetAddress = '转移的目的地址'; 

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

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

async function sendData() {
    const data = '16进制数据';

    let nonce = 0;
    let currentGasPrice = 0;
    let amount = 1000    // 循环次数
    for (let i = 0; i < amount; i++) {    
        try {
            let j = i % 10;    //  每10次交易重新获取nonce和GasPrice
            if(j == 0) {
                nonce = await getCurrentNonce(wallet);
                currentGasPrice = await provider.getGasPrice();
            }
            const tx = await wallet.sendTransaction({
                to: targetAddress,
                value: 0,
                data: data,
                gasPrice: currentGasPrice,
                nonce: nonce + j
            });
            await sleep(300);    //暂停0.3秒，可根据实际情况修改
            console.log(`第 ${i + 1} 次数据交易哈希:`, tx.hash);
        } catch (error) {
            i--;
            console.error('发生异常:', error.message);
        }
    }
}

sendData();
