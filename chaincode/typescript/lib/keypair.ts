/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

import { Context } from 'fabric-contract-api';
import { BlockotusContract } from 'hyperledger-fabric-chaincode-helper';

export class Keypair extends BlockotusContract {

    constructor(...args) {
        super(...args);
    }

    public async initLedger() {
        console.log('initLedger');
    }

    /**
     * Cross-contract invokeChaincode() does not support Parent Contract method as far as I know.
     * This is why we duplicate the method here.
     * Because the method is called from Did contract https://github.com/BLOCKOTUS/did
     */
    public async did(ctx: Context, subject: string, method: string, data: string): Promise<string> {
        return this.didRequest(ctx, subject, method, data);
    }

    /**
     * Store a shared keypair.
     * 
     * @param sharedWith
     * @param groupId
     * @param myEncryptedKeyPair
     * @param type = 'job'
     */
    public async createSharedKeypair(ctx: Context) {
        const params = this.getParams(ctx, { length: 4 });

        const id = this.getUniqueClientId(ctx);
        const sharedKeyPairId = `${params[3]}||${id}||${params[1]}`;

        // check if the keyapir already exists or not
        const existing = await this.exists(ctx, sharedKeyPairId);
        if (existing) { throw new Error(`${sharedKeyPairId} already exists.`); }

        const sharedWith = JSON.parse(params[0]);
        const value = {};
        value[id] = {keypair: params[2], isCreator: true};

        // prepare an object containing the encrypted keypair version of each user who was given a copy
        for (const eUserId in sharedWith) {
            if (sharedWith.hasOwnProperty(eUserId)) {
                value[eUserId] = {
                    isCreator: false,
                    keypair: sharedWith[eUserId].keypair,
                };
            }
        }

        // put the object in the ledger
        await ctx.stub.putState(sharedKeyPairId, Buffer.from(JSON.stringify(value)));

        // put the indexes
        const compositeKey = await ctx.stub.createCompositeKey('id~groupId~type', [id, params[1], params[3]]);
        const compositeKeyReverse = await ctx.stub.createCompositeKey('groupId~id~type', [params[1], id, params[3]]);
        await ctx.stub.putState(compositeKey, Buffer.from('\u0000'));
        await ctx.stub.putState(compositeKeyReverse, Buffer.from('\u0000'));
        return;
    }

    /**
     * Get a shared keypair.
     * 
     * @param keypairId
     */
    public async getKeypair(ctx: Context) {
        const params = this.getParams(ctx, { length: 1 });

        const id = this.getUniqueClientId(ctx);
        const sharedKeyPairId = params[0];

        // retrieve keypair object
        const stringKeypairObject = await this.didGet(ctx, sharedKeyPairId);
        const keypairObject = JSON.parse(stringKeypairObject);

        // look for the keypair shared with the user
        if (keypairObject[id] === undefined) { throw new Error(`${sharedKeyPairId} is not shared with you.`); }

        return keypairObject[id].keypair;
    }

}
