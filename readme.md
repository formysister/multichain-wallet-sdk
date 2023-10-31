# ⚠ This library is under construction ⚠
## multichain-wallet-sdk  [multichain wallet development kit]
### installation

<span style="color: orange;">Old version package was deprecated from NPM. New one will be published.</span>

```
npm install vipay-multichain-wallet
```
### import (es5)
```javascript
const vipay = require('vipay-multichain-wallet');
```
### import (es6)
```javascript
import vipay from 'vipay-multichain-wallet';
```

### Create Wallet (Phrase words) using `common` function
```javascript
const mnemonic = vipay.Common.generateMnemonic();
console.log(mnemonic); //sea gulp tiger cup zoo ...
```

### functions (ethereum)
- Create Wallet
- Recover wallet from phrase words
- Import account from private key
- Get ETH balance
- Send ETH
- Approve/Transfer Token

### usage (ethereum)
```javascript
//Create Wallet
const wallet = await vipay.Ethereum.createWallet({});

//Import Wallet
const wallet = await vipay.Ethereum.importWallet({
	mnemonic: 'sea glup tiger cup zoo ...', //phrase words
});

//Import Account
const account = await vipay.Ethereum.importAccount({
	privateKey: '0x....' //private key
});

//Get ETH balance
const balance = await vipay.Ethereum.getBalance({
	defaultProviderRpcUrl: 'https://https://bsc-dataseed1.defibit.io/', //this is bsc mainnet rpc url (put any ethereum network rpc url here)
	address: '0x...'
});

//Send ETH
const tx = await vipay.Ethereum.sendEther({
	rpcUrl: 'https://....',// (pur rpc url here)
	privateKey: '0x....',
	receiveAddress: '0x...',
	amount: '0.1', //ETH amount
	gasPrice: 'xxx', //transaction gas fee
	gasLimit: 'xxx', //gas limit
});

//Token Transfer
const tx = await vipay.Ethereum.tokenTransfer({
	rpcUrl: 'https://....',// (pur rpc url here)
	privateKey: '0x....',
	receiveAddress: '0x...',
	tokenAddress: '0x...',
	amount: '0.1', //Token amount
	gasPrice: 'xxx', //transaction gas fee
	gasLimit: 'xxx', //gas limit
});

//Token Approve
const tx = await vipay.Ethereum.tokenApprove({
	rpcUrl: 'https://....',// (pur rpc url here)
	privateKey: '0x....',
	receiveAddress: '0x...',
	tokenAddress: '0x...',
	amount: '0.1', //Token amount
	gasPrice: 'xxx', //transaction gas fee
	gasLimit: 'xxx', //gas limit
})
```

### functions (solana)
- Create Wallet
- Recover wallet from phrase words
- Import account from private key
- Send SOL token
- Get token info
- Get availale token list
- Get balance
- Get transaction

### usage (solana)
```javascript
const wallet = await vipay.Solana.createWallet({});

const importWallet = await vipay.Solana.importWallet({
	mnemonic: 'xxx'//mnemonic
})

const importAccount = await vipay.Solana.importWallet({
	privateKey: 'xxx' //privatekey
})

const tx = await vipay.Solana.transfer({
	rpcUrl: 'https://api.devnet.solana.com', //rpcurl
	privateKey: 'xxx',
	from: 'xxx',
	to: 'xxx',
	amount: 0.1
})

// please refer library for more functions
```

### More blockchains and networks will be added.

## Enjoy your work ~!!!
