const assert = require('chai').assert,
    { FactomdCli } = require('../src/apis-cli'),
    { Entry, computeEntryTxId } = require('../src/entry'),
    { Chain, computeChainTxId } = require('../src/chain'),
    add = require('../src/add');

const factomd = new FactomdCli();
const PAYING_EC_ADDRESS = 'Es4D1XXGBBJcWea54xDLMVYgobHzciXKfPSxoZNdsbdjxJftPM6Y';

describe('Add chains and entries in Factom blockchain', function () {

    it('should commit and then reveal chain', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js')
            .extId('commit/reveal chain test', 'utf8')
            .extId(Date.now().toString() + Math.random(), 'utf8')
            .build();

        const c = new Chain(e);

        // Commit
        const committed = await add.commit(factomd, c, PAYING_EC_ADDRESS);
        assert.equal(committed.txId, computeChainTxId(c).toString('hex'));

        // Reveal
        const revealed = await add.reveal(factomd, c, PAYING_EC_ADDRESS);
        assert.equal(revealed.entryHash, c.firstEntry.hashHex());
        assert.equal(revealed.chainId, c.idHex);
    });

    it('should commit and then reveal entry', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .chainId('954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4')
            .timestamp(Date.now())
            .extId('factom.js')
            .extId('commit/reveal entry test', 'utf8')
            .extId(Date.now().toString() + Math.random(), 'utf8')
            .build();

        // Commit
        const committed = await add.commit(factomd, e, PAYING_EC_ADDRESS);
        assert.equal(committed.txId, computeEntryTxId(e).toString('hex'));

        // Reveal
        const revealed = await add.reveal(factomd, e, PAYING_EC_ADDRESS);
        assert.equal(revealed.entryHash, e.hashHex());
        assert.equal(revealed.chainId, '954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4');
    });

    it('should reject commit entry without chainId', async function () {

        const e = Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('commit entry test', 'utf8')
            .extId(Date.now().toString(), 'utf8')
            .build();

        try {
            await add.commit(factomd, e, PAYING_EC_ADDRESS);
        } catch (e) {
            assert.instanceOf(e, Error);
            return;
        }
        throw new Error('Should have rejected entry without chainId');
    });

    it('should reject reveal entry without chainId', async function () {

        const e = Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('reveal entry test', 'utf8')
            .extId(Date.now().toString(), 'utf8')
            .build();

        try {
            await add.reveal(factomd, e, PAYING_EC_ADDRESS);
        } catch (e) {
            assert.instanceOf(e, Error);
            return;
        }
        throw new Error('Should have rejected entry without chainId');
    });

    it('should add chain', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js')
            .extId('add chain test', 'utf8')
            .extId(Date.now().toString(), 'utf8')
            .build();

        const c = new Chain(e);

        const added = await add.add(factomd, c, PAYING_EC_ADDRESS);

        assert.equal(added.entryHash, c.firstEntry.hashHex());
        assert.equal(added.chainId, c.idHex);
        assert.equal(added.repeatedCommit, false);
        assert.equal(added.txId, computeChainTxId(c).toString('hex'));
    });

    it('should notify repeated commit', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js')
            .extId('add chain test', 'utf8')
            .extId(Date.now().toString(), 'utf8')
            .build();

        const c = new Chain(e);

        await add.commit(factomd, c, PAYING_EC_ADDRESS);
        const repeated = await add.commit(factomd, c, PAYING_EC_ADDRESS);
        assert.equal(repeated.repeatedCommit, true);
        assert.isUndefined(repeated.txId);
    });

    it('should add entry', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .chainId('954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4')
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('add entry test', 'utf8')
            .extId(Date.now().toString(), 'utf8')
            .build();

        const added = await add.add(factomd, e, PAYING_EC_ADDRESS);

        assert.equal(added.entryHash, e.hashHex());
        assert.equal(added.chainId, '954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4');
        assert.equal(added.repeatedCommit, false);
        assert.equal(added.txId, computeEntryTxId(e).toString('hex'));
    });

    it('should reject add entry without chainId', async function () {

        const e = Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('add entry test', 'utf8')
            .extId(Date.now().toString(), 'utf8')
            .build();

        try {
            await add.add(factomd, e, PAYING_EC_ADDRESS);
        } catch (e) {
            assert.instanceOf(e, Error);
            return;
        }
        throw new Error('Should have rejected entry without chainId');
    });

    it('should add entries', async function () {
        this.timeout(10000);

        const e1 = Entry.builder()
            .chainId('954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4')
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('add entries test', 'utf8')
            .extId(Date.now().toString() + Math.random(), 'utf8')
            .build();

        const e2 = Entry.builder()
            .chainId('954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4')
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('add entries test', 'utf8')
            .extId(Date.now().toString() + Math.random(), 'utf8')
            .build();

        const added = await add.add(factomd, [e1, e2], PAYING_EC_ADDRESS, { chunkSize: 1 });

        assert.lengthOf(added, 2);
        assert.equal(added[0].entryHash, e1.hashHex());
        assert.equal(added[0].chainId, '954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4');
        assert.equal(added[0].repeatedCommit, false);
        assert.equal(added[0].txId, computeEntryTxId(e1).toString('hex'));
    });

    it('should add chains', async function () {
        this.timeout(15000);

        const c1 = new Chain(Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('add chains test', 'utf8')
            .extId(Date.now().toString() + Math.random(), 'utf8')
            .build());

        const c2 = new Chain(Entry.builder()
            .timestamp(Date.now())
            .extId('factom.js', 'utf8')
            .extId('add chains test', 'utf8')
            .extId(Date.now().toString() + Math.random(), 'utf8')
            .build());

        const added = await add.add(factomd, [c1, c2], PAYING_EC_ADDRESS, { chunkSize: 1 });

        assert.lengthOf(added, 2);
        assert.equal(added[0].entryHash, c1.firstEntry.hashHex());
        assert.equal(added[0].chainId, c1.idHex);
        assert.equal(added[0].repeatedCommit, false);
        assert.equal(added[0].txId, computeChainTxId(c1).toString('hex'));
    });

    it('should throw when adding an already existing chain', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .extId('test', 'utf8')
            .content('hello', 'utf8')
            .build();

        const c = new Chain(e);

        try {
            await add.add(factomd, c, PAYING_EC_ADDRESS);
        } catch (e) {
            assert.include(e.message, 'already exists');
            return;
        }
        throw new Error('Should have thrown.');
    });

    it('should throw when not enough EC', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .chainId('8f6f7d99fb4fe51fcba7679780aa2c21fcf7f3a85e6658b72fa33a2baaecd911')
            .extId('hello', 'utf8')
            .content(Math.random().toString(), 'utf8')
            .build();

        try {
            await add.add(factomd, e, 'Es3WC5Pr54jsppooWWvGEqeqsauQFJaZuBMdXCBWSDA3wkzWK9cC');
        } catch (e) {
            assert.include(e.message, 'not sufficient to pay');
            return;
        }
        throw new Error('Should have thrown.');
    });

    it('should bypass fund validation', async function () {
        this.timeout(10000);

        const e = Entry.builder()
            .chainId('8f6f7d99fb4fe51fcba7679780aa2c21fcf7f3a85e6658b72fa33a2baaecd911')
            .extId('hello', 'utf8')
            .content(Math.random().toString(), 'utf8')
            .build();

        await add.add(factomd, e, 'Es3WC5Pr54jsppooWWvGEqeqsauQFJaZuBMdXCBWSDA3wkzWK9cC',
            { skipFundValidation: true, commitTimeout: -1, revealTimeout: -1 });

    });

});