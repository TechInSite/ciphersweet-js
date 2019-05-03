"use strict";

const assert = require('assert');
const expect = require('chai').expect;
const fs = require('fs-extra');
const sodium = require('sodium-native');

const BlindIndex = require('../lib/blindindex');
const CipherSweet = require('../lib/ciphersweet');
const EncryptedFile = require('../lib/encryptedfile');
const FIPSCrypto = require('../lib/backend/fipsrypto');
const ModernCrypto = require('../lib/backend/moderncrypto');
const StringProvider = require('../lib/keyprovider/stringprovider');
const Util = require('../lib/util');

let fipsEngine = new CipherSweet(
    new StringProvider('4e1c44f87b4cdf21808762970b356891db180a9dd9850e7baf2a79ff3ab8a2fc'),
    new FIPSCrypto()
);
let naclEngine = new CipherSweet(
    new StringProvider('4e1c44f87b4cdf21808762970b356891db180a9dd9850e7baf2a79ff3ab8a2fc'),
    new ModernCrypto()
);

describe('EncryptedFile', function () {
    it('FIPS Backend', async function () {
        await fs.writeFile(__dirname+'/file-test-0001.txt', 'This is just a test file.\n\nNothing special.');
        let eF = new EncryptedFile(fipsEngine);
        await eF.encryptFile(__dirname+'/file-test-0001.txt', __dirname+'/file-test-0001.out');
        await eF.decryptFile(__dirname+'/file-test-0001.out', __dirname+'/file-test-0001.dec');

        let read0 = await fs.readFile(__dirname+'/file-test-0001.txt');
        let read1 = await fs.readFile(__dirname+'/file-test-0001.dec');
        expect(read0.toString('hex')).to.be.equals(read1.toString('hex'));
    })
});
