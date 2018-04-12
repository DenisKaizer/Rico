const BigNumber = web3.BigNumber;

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
        var period = 100000
        PreSaleInstance = await PreSaleInterface.deployed(start, 
                                                          period, 
                                                          accounts[1], 
                                                          TokenInstance.address, 100);

        await TokenInstance.addAdmin(PreSaleInstance.address, {from: accounts[0]})
    });

    it("buy tokens increase balance", async () => {
        console.log(0)
        let oldBalance = await TokenInstance.balanceOf(accounts[2]);
        console.log(oldBalance);
    
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
        assert.ok(err instanceof Error) 
    })

    it("buy tokens restrict underhardcap", async () => {
        await PreSaleInstance.sendTransaction({value: 50 * 1e+9, from: accounts[2]});
        try {
            await PreSaleInstance.sendTransaction({value: 1400 * 1e+9, from: accounts[2]});
        } catch (error) {
            err = error
        }
        assert.ok(err instanceof Error) 
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
