const { expect } = require("chai");

describe("GitstakeToken - transferFrom", function () {
    let token;
    let owner, addr1, addr2;
    const initialSupply = ethers.parseEther("1000"); // 1000 tokens

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the token contract
        const Token = await ethers.getContractFactory("GitstakeToken");
        token = await Token.deploy(initialSupply);
        await token.deployed();

        // Transfer some tokens to addr1
        await token.transfer(addr1.address, ethers.parseEther("100")); // addr1 gets 100 tokens
    });

    it("should revert if trying to transfer without approval", async function () {
        // Attempt transferFrom without approval should fail
        await expect(token.connect(addr2).transferFrom(addr1.address, addr2.address, ethers.parseEther("10")))
            .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should transfer tokens if approved", async function () {
        const transferAmount = ethers.utils.parseEther("20");

        // Addr1 approves addr2 to spend 20 tokens on their behalf
        await token.connect(addr1).approve(addr2.address, transferAmount);

        // Addr2 calls transferFrom to transfer tokens from addr1 to addr2
        await token.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount);

        // Check balances after transfer
        expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("80")); // 100 - 20
        expect(await token.balanceOf(addr2.address)).to.equal(transferAmount); // 20 tokens received
    });

    it("should update allowance after transferFrom", async function () {
        const transferAmount = ethers.utils.parseEther("20");
        const approveAmount = ethers.utils.parseEther("50");

        // Addr1 approves addr2 to spend 50 tokens
        await token.connect(addr1).approve(addr2.address, approveAmount);

        // Addr2 calls transferFrom to transfer 20 tokens from addr1
        await token.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount);

        // Check remaining allowance (50 - 20 = 30)
        const remainingAllowance = await token.allowance(addr1.address, addr2.address);
        expect(remainingAllowance).to.equal(ethers.utils.parseEther("30"));
    });

    it("should revert if trying to transfer more than allowance", async function () {
        const approveAmount = ethers.utils.parseEther("30");
        const transferAmount = ethers.utils.parseEther("40");

        // Addr1 approves addr2 to spend 30 tokens
        await token.connect(addr1).approve(addr2.address, approveAmount);

        // Try transferring 40 tokens, which exceeds the allowance
        await expect(token.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount))
            .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should revert if trying to transfer more than balance", async function () {
        const transferAmount = ethers.utils.parseEther("150");

        // Addr1 approves addr2 to spend 150 tokens, but addr1 only has 100 tokens
        await token.connect(addr1).approve(addr2.address, transferAmount);

        // Attempt transferFrom of more tokens than addr1's balance
        await expect(token.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount))
            .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
});