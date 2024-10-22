// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error GitHubStaking__UnsuccessfullTransfer(address from, address to);
error GitHubStaking__MinPrizeRequired();
error GitHubStaking__MinStakeAmtRequired();
error GitHubStaking__IssueAlreadyExists();
error GitHubStaking__IssueCreatorCannotStake();
error GitHubStaking__IssueDoesNotExist(uint repoId, uint issueId);
error GitHubStaking__IssueAlreadySolved();
error GitHubStaking__IssueHasStakers();
error GitHubStaking__CannotDeclareYourselfWinner();
error GitHubStaking__CreatorRightsOnly();
error GitHubStaking__WrongSolverError();
error GitHubStaking__DeductionError();
error GitHubStaking__NoWithdrawals();
error GitHubStaking__NotEnoughETHSent();

contract GitHubStaking {
    struct Stake {
        address staker;
        uint amt;
        uint pullReqId;
    }
    struct Issue {
        address creator;
        uint prize;
        bool solved;
        address solver;
        uint stakeCount;
        uint totalStakeAmt;
        mapping(uint => Stake) stakes; // index -> konsa address, kitna stakeAmt
    }

    struct Repo {
        mapping(uint => Issue) issues;
        uint issueCount;
    }
    struct WalletStats {
        uint lostStakeCount;
        uint wonStakeCount;
        uint totalAmtStaked;
        uint openAmtStaked;
        uint totalStakes;
        uint openStakes;
        uint rewardsEarned;
        uint withdraw_proceedings;
        uint lost_refund;
    }

    struct IssueStats {
        uint totalPriceAmt_SetByMe;
        uint openPriceAmt_SetByMe;
        uint totalIssues_SetByMe;
        uint openIssues_SetByMe;
    }

    struct Wallet {
        string gitUsername;
        WalletStats stats;
        IssueStats issueStats;
    }

    event IssueCreated(
        uint256 indexed repoId,
        uint256 indexed issueId,
        address indexed creator,
        uint256 prize
    );

    event IssueSolved(
        uint256 indexed repoId,
        uint256 indexed issueId,
        uint256 pullReqId,
        address creator,
        address indexed solver,
        uint256 prize
    );

    event StakePlaced(
        uint256 indexed repoId,
        uint256 indexed issueId,
        uint256 index,
        uint256 pullReqId,
        address indexed staker,
        uint256 amt
    );

    mapping(uint => Repo) public repos; // RepoId -> Repo
    mapping(address => Wallet) public wallets;

    uint256 private constant MIN_PRIZE = 20;
    uint256 private constant MIN_STAKE = 10;

    uint private TOTAL_DEDUCTIONS = 0;
    uint private SOLD_TOKENS = 0;
    uint private TOTAL_RAISED = 0;
    uint private RATE = 0.003 ether;
    uint private constant k = 0.000001 ether;

    IERC20 public s_token;
    address public immutable i_owner;

    constructor(address token) {
        s_token = IERC20(token);
        i_owner = msg.sender;
    }

    function addUserToWallet(address wallet, string memory username) external {
        wallets[wallet].gitUsername = username;
    }

    function getCurrentPrice() public view returns (uint256) {
        return RATE + k * (SOLD_TOKENS ** 2);
    }

    function getTotalRiased() external view returns (uint256) {
        return TOTAL_RAISED;
    }

    function requestTokens(uint ethAmt) external payable {
        uint256 tokenPrice = getCurrentPrice();
        if (ethAmt <= tokenPrice) {
            revert GitHubStaking__NotEnoughETHSent();
        }
        uint256 tokenAmount = ethAmt / tokenPrice; // 1/0.001 = 1000

        bool success = s_token.transfer(msg.sender, tokenAmount);
        if (!success) {
            revert GitHubStaking__UnsuccessfullTransfer(
                address(this),
                msg.sender
            );
        }
        SOLD_TOKENS = SOLD_TOKENS + tokenAmount;
        TOTAL_RAISED += ethAmt;
    }

    function createIssue(
        uint repoId,
        uint issueId,
        uint256 prize
    ) external payable {
        // require(
        //     wallets[msg.sender].gitUsername != "",
        //     "Wallet not found in contract."
        // );

        if (prize < MIN_PRIZE) {
            revert GitHubStaking__MinPrizeRequired();
        }
        Repo storage repo = repos[repoId];
        Issue storage issue = repo.issues[issueId];

        if (issue.creator != address(0)) {
            revert GitHubStaking__IssueAlreadyExists();
        }

        bool success = s_token.transferFrom(msg.sender, address(this), prize);
        if (success) {
            issue.creator = msg.sender;
            issue.prize = prize;
            issue.solved = false;
            issue.solver = address(0);
            issue.stakeCount = 0;
            issue.totalStakeAmt = 0;
            repo.issueCount++;

            Wallet storage wallet = wallets[msg.sender];

            IssueStats storage issueStats = wallet.issueStats;

            issueStats.totalIssues_SetByMe++;
            issueStats.openIssues_SetByMe++;
            issueStats.totalPriceAmt_SetByMe += prize;
            issueStats.openPriceAmt_SetByMe += prize;

            emit IssueCreated(repoId, issueId, msg.sender, prize);
        } else {
            revert GitHubStaking__UnsuccessfullTransfer(
                msg.sender,
                address(this)
            );
        }
    }

    // Stake an amount on an issue
    function stakeOnIssue(
        uint repoId,
        uint issueId,
        uint pullReqId,
        uint256 amt
    ) external payable {
        if (amt < MIN_STAKE) {
            revert GitHubStaking__MinStakeAmtRequired();
        }

        Issue storage issue = repos[repoId].issues[issueId];

        if (issue.creator == msg.sender) {
            revert GitHubStaking__IssueCreatorCannotStake();
        }
        if (issue.creator == address(0)) {
            revert GitHubStaking__IssueDoesNotExist(repoId, issueId);
        }
        if (issue.solved) {
            revert GitHubStaking__IssueAlreadySolved();
        }

        bool success = s_token.transferFrom(msg.sender, address(this), amt);
        if (success) {
            issue.stakeCount++;
            Stake storage newStake = issue.stakes[issue.stakeCount];
            newStake.pullReqId = pullReqId;
            newStake.staker = msg.sender;
            newStake.amt = amt;

            issue.totalStakeAmt += amt;

            WalletStats storage walletstats = wallets[msg.sender].stats;

            walletstats.totalAmtStaked += amt;
            walletstats.openAmtStaked += amt;

            walletstats.totalStakes++;
            walletstats.openStakes++;
            emit StakePlaced(
                repoId,
                issueId,
                issue.stakeCount,
                pullReqId,
                msg.sender,
                amt
            );
        } else {
            revert GitHubStaking__UnsuccessfullTransfer(
                msg.sender,
                address(this)
            );
        }
    }

    function closeIssueNoSolver(uint repoId, uint issueId) external payable {
        Issue storage issue = repos[repoId].issues[issueId];
        if (issue.creator == address(0)) {
            revert GitHubStaking__IssueDoesNotExist(repoId, issueId);
        }
        if (issue.stakeCount != 0) {
            revert GitHubStaking__IssueHasStakers();
        }
        if (issue.solved) {
            revert GitHubStaking__IssueAlreadySolved();
        }
        issue.solved = true;
        bool success = s_token.transfer(issue.creator, issue.prize);
        if (!success) {
            revert GitHubStaking__UnsuccessfullTransfer(
                address(this),
                issue.creator
            );
        }
    }

    function markSolved(
        uint repoId,
        uint issueId,
        uint pullReqIndex,
        uint pullReqId,
        address solver
    ) external payable {
        if (msg.sender == solver) {
            revert GitHubStaking__CannotDeclareYourselfWinner();
        }

        Issue storage issue = repos[repoId].issues[issueId];

        if (issue.solved) {
            revert GitHubStaking__IssueAlreadySolved();
        }

        if (msg.sender != issue.creator) {
            revert GitHubStaking__CreatorRightsOnly();
        }

        Stake storage stake = issue.stakes[pullReqIndex];

        if (stake.staker != solver && stake.pullReqId != pullReqId) {
            revert GitHubStaking__WrongSolverError();
        }

        updateWalletForSolver(solver, issue.prize, stake.amt);

        issue.solved = true;
        issue.solver = solver;
        issue.stakeCount--;

        IssueStats storage senderIssueStats = wallets[msg.sender].issueStats;
        IssueStats storage creatorIssueStats = wallets[issue.creator]
            .issueStats;

        senderIssueStats.totalIssues_SetByMe++;
        senderIssueStats.openIssues_SetByMe++;
        creatorIssueStats.openPriceAmt_SetByMe -= issue.prize;
        creatorIssueStats.openIssues_SetByMe--;

        emit IssueSolved(
            repoId,
            issueId,
            pullReqId,
            msg.sender,
            solver,
            issue.prize
        );

        if (issue.stakeCount > 0) {
            rejectOthers(repoId, issueId, pullReqIndex, solver);
        }
    }

    function updateWalletForSolver(
        address solver,
        uint prize,
        uint stakedAmt
    ) internal {
        WalletStats storage walletstats = wallets[solver].stats;
        walletstats.wonStakeCount++;
        walletstats.rewardsEarned += prize;
        walletstats.withdraw_proceedings += prize;
        walletstats.openStakes--;
        walletstats.openAmtStaked -= stakedAmt;
    }

    function rejectOthers(
        uint repoId,
        uint issueId,
        uint pullReqIndex, // won
        address solver
    ) internal {
        Issue storage issue = repos[repoId].issues[issueId];

        for (uint i = 1; i <= issue.stakeCount; i++) {
            address staker = issue.stakes[i].staker;

            if (staker == address(0)) {
                continue;
            }

            if (staker == solver && pullReqIndex == i) {
                continue; //skip solver
            }
            uint amount = issue.stakes[i].amt;
            WalletStats storage walletstats = wallets[staker].stats;
            walletstats.openAmtStaked -= amount;

            // uint deduction = ((amount * DEDUCTION_FACTOR) / (issue.stakeCount * 100));
            uint df = getDeductionFactor(issue.stakeCount);
            uint deduction = (amount * df) / (100);
            uint refund = amount - deduction;

            TOTAL_DEDUCTIONS += deduction;

            if (refund >= amount) {
                revert GitHubStaking__DeductionError();
            }
            walletstats.openStakes--;
            walletstats.lostStakeCount++;
            walletstats.lost_refund += refund;
            walletstats.withdraw_proceedings -= refund;
        }
    }

    function withdrawStake(
        uint repoId,
        uint issueId,
        uint pullReqIndex
    ) external payable {
        Issue storage issue = repos[repoId].issues[issueId];
        Stake storage stake = issue.stakes[pullReqIndex];

        if (stake.staker != msg.sender) {
            revert GitHubStaking__CreatorRightsOnly();
        }

        if (issue.solved) {
            revert GitHubStaking__IssueAlreadySolved();
        }

        bool success = s_token.transfer(msg.sender, stake.amt);
        if (!success) {
            revert GitHubStaking__UnsuccessfullTransfer(
                address(this),
                msg.sender
            );
        }
        issue.stakeCount--;
        issue.totalStakeAmt -= stake.amt;

        WalletStats storage walletstats = wallets[msg.sender].stats;
        walletstats.totalAmtStaked -= stake.amt;
        walletstats.openAmtStaked -= stake.amt;
        walletstats.openStakes--;
        walletstats.totalStakes--;
    }

    // Withdraw refund balance
    function withdraw_reward() external payable {
        WalletStats storage walletstats = wallets[msg.sender].stats;
        uint amount = walletstats.withdraw_proceedings;

        if (amount <= 0) {
            revert GitHubStaking__NoWithdrawals();
        }

        walletstats.withdraw_proceedings = 0;
        bool success = s_token.transfer(msg.sender, amount);
        if (!success) {
            revert GitHubStaking__UnsuccessfullTransfer(
                address(this),
                msg.sender
            );
        }
    }

    function getBasicWalletDetails()
        external
        view
        returns (
            string memory gitUsername,
            uint lostStakeCount,
            uint wonStakeCount
        )
    {
        Wallet storage wallet = wallets[msg.sender];
        return (
            wallet.gitUsername,
            wallet.stats.lostStakeCount,
            wallet.stats.wonStakeCount
        );
    }

    function getStakingWalletDetails()
        external
        view
        returns (
            uint totalAmtStaked,
            uint openAmtStaked,
            uint totalStakes,
            uint openStakes
        )
    {
        Wallet storage wallet = wallets[msg.sender];
        return (
            wallet.stats.totalAmtStaked,
            wallet.stats.openAmtStaked,
            wallet.stats.totalStakes,
            wallet.stats.openStakes
        );
    }

    function getRewardsWalletDetails()
        external
        view
        returns (
            uint rewardsEarned,
            uint withdraw_proceedings,
            uint lost_refund
        )
    {
        Wallet storage wallet = wallets[msg.sender];
        return (
            wallet.stats.rewardsEarned,
            wallet.stats.withdraw_proceedings,
            wallet.stats.lost_refund
        );
    }

    function getIssueStats()
        external
        view
        returns (
            uint totalPriceAmt_SetByMe,
            uint openPriceAmt_SetByMe,
            uint totalIssues_SetByMe,
            uint openIssues_SetByMe
        )
    {
        Wallet storage wallet = wallets[msg.sender];
        return (
            wallet.issueStats.totalPriceAmt_SetByMe,
            wallet.issueStats.openPriceAmt_SetByMe,
            wallet.issueStats.totalIssues_SetByMe,
            wallet.issueStats.openIssues_SetByMe
        );
    }

    function getTotalStakeAmount(
        uint repoId,
        uint issueId
    ) external view returns (uint256) {
        return repos[repoId].issues[issueId].totalStakeAmt;
    }

    function getIssue(
        uint repoId,
        uint issueId
    )
        external
        view
        returns (
            address creator,
            uint prize,
            bool solved,
            address solver,
            uint stakeCount,
            uint totalStakeAmt
        )
    {
        Issue storage issue = repos[repoId].issues[issueId];
        if (issue.creator == address(0)) {
            revert GitHubStaking__IssueDoesNotExist(repoId, issueId);
        }
        return (
            issue.creator,
            issue.prize,
            issue.solved,
            issue.solver,
            issue.stakeCount,
            issue.totalStakeAmt
        );
    }

    function getStakeCount(
        uint repoId,
        uint issueId
    ) external view returns (uint) {
        return repos[repoId].issues[issueId].stakeCount;
    }

    function getIssueCount(uint repoId) external view returns (uint) {
        Repo storage repo = repos[repoId];
        return repo.issueCount;
    }

    function getStake(
        uint repoId,
        uint issueId,
        uint index
    )
        external
        view
        returns (uint pullReqIndex, uint pullReqId, address staker, uint amt)
    {
        Issue storage issue = repos[repoId].issues[issueId];
        Stake storage stake = issue.stakes[index];
        if (issue.creator == address(0)) {
            revert GitHubStaking__IssueDoesNotExist(repoId, issueId);
        }
        return (index, stake.pullReqId, stake.staker, stake.amt);
    }

    function getDeductionFactor(uint count) public pure returns (uint) {
        if (count <= 3) return 10;
        return 15;
    }

    function getEstDeductionRateOnIssue(
        uint repoId,
        uint issueId,
        uint approx_amt
    ) external view returns (uint) {
        Issue storage issue = repos[repoId].issues[issueId];
        uint df = getDeductionFactor(issue.stakeCount);
        uint deduction = (approx_amt * df) / (100);
        return deduction;
    }

    function getSoldTokens() external view returns (uint) {
        return SOLD_TOKENS;
    }

    function getTotalDeductions() external view returns (uint) {
        if (msg.sender != i_owner) {
            revert GitHubStaking__CreatorRightsOnly();
        }
        return TOTAL_DEDUCTIONS;
    }
}
