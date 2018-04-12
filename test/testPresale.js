const BigNumber = web3.BigNumber;
const assert = require('assert').strict;

var unix = Math.round(+new Date()/1000);

var PreSaleInterface = artifacts.require("./PreSale.sol");
var RicoTokenInterface = artifacts.require("./RicoToken.sol");

var TokenInstance;
var PreSaleInstance;

contract('TestPresale', function (accounts) {

    beforeEach(async () => {
        // Rico Token
        TokenInstance = await RicoTokenInterface.deployed({from: accounts[0]});

        // Presale 
        var start = unix
        var period = 0
        PreSaleInstance = await PreSaleInterface.deployed(start, 
                                                          period, 
                                                          accounts[1], 
                                                          TokenInstance.address, 100);
        await TokenInstance.addAdmin(PreSaleInstance.address, {from: accounts[0]})
    });

    it("buy tokens increase balance", async () => {
        let oldBalance = await TokenInstance.balanceOf(accounts[2]);
    
        await PreSaleInstance.sendTransaction({value: 1e+17, from: accounts[2]})
        let newBalance = await TokenInstance.balanceOf(accounts[2]);
        
        assert.equal((newBalance > oldBalance), true);
    })

    it("buy tokens restrict minimum invest", async () => {
        let oldBalance = TokenInstance.balanceOf(accounts[1]);
        
        try {
            await PreSaleInstance.sendTransaction({ value: 50, from: accounts[1] })    
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error);
    })

    it("buy tokens restrict underhardcap", async () => {
        console.log(web3.eth.getBalance(accounts[2]));
        await PreSaleInstance.sendTransaction({value: 5 * 1e+18, from: accounts[2]})
        console.log(web3.eth.getBalance(accounts[2]));
        try {
            await PreSaleInstance.sendTransaction({value: 1500 * 1e+18, from: accounts[2]});
        } catch (error) {
            err = error;
        }
        console.log(web3.eth.getBalance(accounts[2]));
        assert.ok(err instanceof Error);
    })

    it("buy tokens from zero address", async () => {
        
        try {
            await PreSaleInstance.sendTransaction({ value: 50, from: 0 })
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error);
    })

    it("refund works correct", async () => {
        var oldBalance = web3.eth.getBalance(accounts[2]);
        console.log(0);
        await PreSaleInstance.sendTransaction({value: 1 * 1e+18, from: accounts[2]});
        console.log(1);
        await PreSaleInstance.refund({from: accounts[2]});
        console.log(2);
        var newBalance = web3.eth.getBalance(accounts[2]);
        console.log(newBalance);
        console.log(oldBalance);
        assert.ok(oldBalance - newBalance < 1000000);

    })

    // it("chck perms", async () => {
    //     let TokenInstance = await Token.deployed();
    //     let PresaleInstance = await Presale.deployed();
    //     let WhiteListInstance = await WhiteList.deployed();

    //     try {
    //         await PresaleInstance.changePriceUSD(14692121690100,{from: accounts[1]})
    //         assert.fail()
    //     } catch (error) {
    //         err = error
    //     }
    //     assert.ok(err instanceof Error)
    //     // console.log(err)

    //     try {
    //         await PresaleInstance.setOracle(accounts[1], {from: accounts[1]})
    //         assert.fail()
    //     } catch (error) {
    //         err = error
    //     }
    //     assert.ok(err instanceof Error)
    //     // console.log(err)


    //     await PresaleInstance.setOracle(accounts[1], {from: accounts[0]})

    //     await PresaleInstance.changePriceUSD(14692121690100, {from: accounts[1]})

    //     let priceUSD = await PresaleInstance.priceUSD.call().then(result => result.toNumber());

    //     assert.equal(priceUSD, 14692121690100, "priceUSD");

    //     try {
    //         await PresaleInstance.manualTransfer(accounts[1], 1000,{from: accounts[1]})
    //         assert.fail()
    //     } catch (error) {
    //         err = error
    //     }
    //     assert.ok(err instanceof Error)
    //     // console.log(err)

    //     await PresaleInstance.manualTransfer(accounts[1], 1000,{from: accounts[0]})

    //     let tokenBalance = await TokenInstance.balanceOf(accounts[1]);
    //     tokenBalance = tokenBalance.toNumber();
    //     console.log(tokenBalance)


    //     try {
    //         await PresaleInstance.setManager(accounts[1],{from: accounts[1]})
    //         assert.fail()
    //     } catch (error) {
    //         err = error
    //     }
    //     assert.ok(err instanceof Error)
    //     // console.log(err)

    //     await PresaleInstance.setManager(accounts[1],{from: accounts[0]})

    //     await PresaleInstance.manualTransfer(accounts[1], 1000,{from: accounts[1]})

    //     tokenBalance = await TokenInstance.balanceOf(accounts[1]);
    //     tokenBalance = tokenBalance.toNumber();
    //     console.log(tokenBalance)


    //     await PresaleInstance.manualTransfer(accounts[2], 1000,{from: accounts[1]})

    //     tokenBalance = await TokenInstance.balanceOf(accounts[2]);
    //     tokenBalance = tokenBalance.toNumber();
    //     console.log(tokenBalance)


    //     try {
    //         await PresaleInstance.sendTransaction({ value: 1e+18, from: accounts[2] })
    //         assert.fail()
    //     } catch (error) {
    //         err = error
    //     }
    //     assert.ok(err instanceof Error)
    //     // console.log(err)

    // })


})
