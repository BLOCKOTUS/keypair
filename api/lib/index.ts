import fs from 'fs';
import path from 'path';

import { getContractAndGateway } from '../../../helper/api/dist/index.js';

const WALLET_PATH = path.join(__dirname, '..', '..', '..', '..', 'wallet');

/**
 * Store a `Keypair` and eventually make it readable by other users.
 */
export const share = async ({
  sharedWith,
  groupId,
  myEncryptedKeyPair,
  type,
  user,
}) => {
  return new Promise(async (resolve, reject) => {
    // create wallet
    const walletPath = path.join(WALLET_PATH, `${user.username}.id`);
    fs.writeFileSync(walletPath, JSON.stringify(user.wallet));

    // get contract, submit transaction and disconnect
    const {contract, gateway} = await
      getContractAndGateway({user, chaincode: 'keypair', contract: 'Keypair'})
        .catch(reject);

    if (!contract || !gateway) { return; }

    const response = await
      contract
        .submitTransaction('createSharedKeypair', JSON.stringify(sharedWith), groupId, myEncryptedKeyPair, type)
        .catch(reject);

    await gateway.disconnect();

    if (!response) { return; }

    console.log('Transaction has been submitted', response);
    resolve();
    return;
  });
};

/**
 * Retrieve a `Keypair` from the network.
 */
export const get = async ({
  keypairId,
  user,
}) => {
  return new Promise(async (resolve, reject) => {
    // create wallet
    const walletPath = path.join(WALLET_PATH, `${user.username}.id`);
    fs.writeFileSync(walletPath, JSON.stringify(user.wallet));

    // get contract, submit transaction and disconnect
    const {contract, gateway} = await
      getContractAndGateway({user, chaincode: 'keypair', contract: 'Keypair'})
        .catch(reject);

    if (!contract || !gateway) { return; }

    // submit transaction
    const rawKeypair = await
      contract
        .submitTransaction('getKeypair', keypairId)
        .catch(reject);

    // disconnect
    await gateway.disconnect();

    if (!rawKeypair) { return; }

    const keypair = JSON.parse(rawKeypair.toString('utf8'));

    console.log('Transaction has been submitted');
    resolve(keypair);
    return;
  });
};
