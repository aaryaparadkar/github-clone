// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

// Import the ERC20 token interface from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Define the main contract
contract GitHubStaking {

    // Define a struct to represent an Issue
    struct Issue {
        address creator;  // Address of the issue creator
        uint prize;       // Prize amount for solving the issue
        bool solved;      // Status indicating if the issue is solved
        address solver;   // Address of the user who solved the issue
    }

    // Define a struct to represent a Stake
    struct Stake {
        address staker;  // Address of the user staking tokens
        uint amount;     // Amount of tokens staked
    }

    // Mapping from issue ID to Issue struct
    mapping(uint => Issue) public issues;

    // Nested mapping: issue ID => (stake index => Stake struct)
    mapping(uint => mapping(uint => Stake)) public stakes;

    // Mapping to track the number of stakes per issue
    mapping(uint => uint) public issueStakeCount;

    // Mapping to track earnings for each user
    mapping(address => uint) public earnings;

    // Counter to keep track of the number of issues created
    uint public issueCount;

    // Constant representing the minimum prize amount
    uint256 public constant MIN_PRIZE = 5;

    // Constant representing the deduction factor for non-solvers
    uint private constant DEDUCTION_FACTOR = 10;

    // ERC20 token contract instance
    IERC20 public s_token;

    // Event emitted when an issue is created
    event IssueCreated(
        uint256 indexed issueId,    // Index of the issue
        address indexed creator,    // Address of the issue creator
        uint256 prize               // Prize amount for solving the issue
    );

    // Event emitted when an issue is solved
    event IssueSolved(
        uint256 indexed issueId,    // Index of the issue
        address indexed solver,     // Address of the solver
        uint256 prize               // Prize amount awarded to the solver
    );

    // Event emitted when a stake is placed on an issue
    event StakePlaced(
        uint256 indexed issueId,    // Index of the issue
        address indexed staker,     // Address of the staker
        uint256 amount              // Amount of tokens staked
    );

    // Constructor that initializes the ERC20 token contract instance
    constructor(address token) {
        s_token = IERC20(token);  // Assign the token contract address to s_token
    }

    // Function to create a new issue with a specified prize amount
    function createIssue(uint256 prize) public {
        // Ensure the prize is at least the minimum required
        require(prize >= MIN_PRIZE, "Prize amount must be greater than minimum");

        // Transfer the prize amount from the creator to the contract
        bool success = s_token.transferFrom(msg.sender, address(this), prize);
        require(success, "Token transfer failed");

        // Increment the issue count
        issueCount++;

        // Store the new issue in the issues mapping
        issues[issueCount] = Issue(msg.sender, prize, false, address(0));

        // Emit the IssueCreated event
        emit IssueCreated(issueCount, msg.sender, prize);
    }

    // Function to stake tokens on a specific issue
    function stakeOnIssue(uint issueId, uint256 amt) public {
        // Ensure the issue exists
        require(issues[issueId].creator != address(0), "Issue does not exist");

        // Ensure the issue creator is not the one staking
        require(issues[issueId].creator != msg.sender, "Issue creator cannot stake");

        // Ensure the issue is not already solved
        require(!issues[issueId].solved, "Issue already solved");

        // Transfer the staking amount from the staker to the contract
        bool success = s_token.transferFrom(msg.sender, address(this), amt);
        require(success, "Token transfer failed");

        // Increment the stake count for the issue and store the stake
        uint stakeIndex = issueStakeCount[issueId]++;
        stakes[issueId][stakeIndex] = Stake(msg.sender, amt);

        // Emit the StakePlaced event
        emit StakePlaced(issueId, msg.sender, amt);
    }

    // Function to mark an issue as solved and distribute the prize
    function markSolved(uint issueId, address solver) public {
        // Get a reference to the issue
        Issue storage issue = issues[issueId];

        // Ensure the issue is not already solved
        require(!issue.solved, "Issue already solved");

        // Ensure the caller is the issue creator
        require(msg.sender == issue.creator, "Only issue creator can mark as solved");

        // Add the prize amount to the solver's earnings
        earnings[solver] += issue.prize;

        // Call the rejectOthers function to handle non-solvers
        rejectOthers(issueId, solver);

        // Mark the issue as solved and record the solver's address
        issue.solved = true;
        issue.solver = solver;

        // Emit the IssueSolved event
        emit IssueSolved(issueId, solver, issue.prize);
    }

    // Internal function to handle deductions for stakers who did not solve the issue
    function rejectOthers(uint issueId, address solver) internal {
        // Get the total number of stakers for the issue
        uint totalStakers = getTotalStakers(issueId);

        // Iterate over all stakers
        for (uint i = 0; i < totalStakers; i++) {
            // Skip the solver
            if (stakes[issueId][i].staker == solver) {
                continue;
            }

            // Calculate the deduction for non-solvers
            uint deduction = (stakes[issueId][i].amount / totalStakers * DEDUCTION_FACTOR);

            // Calculate the refund after deduction
            uint refund = stakes[issueId][i].amount - deduction;

            // Add the refund amount to the staker's earnings
            earnings[stakes[issueId][i].staker] += refund;
        }
    }

    // Function to allow users to withdraw their earnings
    function withdraw() public {
        // Get the earnings for the caller
        uint amount = earnings[msg.sender];

        // Ensure there are earnings to withdraw
        require(amount > 0, "No balance to withdraw");

        // Reset the earnings to zero
        earnings[msg.sender] = 0;

        // Transfer the earnings to the caller
        s_token.transfer(msg.sender, amount);
    }

    // Function to get the total number of stakers for a specific issue
    function getTotalStakers(uint issueId) public view returns (uint256) {
        return issueStakeCount[issueId];  // Return the number of stakers for the issue
    }

    // Function to get details of a specific issue
    function getIssueDetails(uint issueId) public view returns (Issue memory) {
        return issues[issueId];  // Return the Issue struct for the given issue ID
    }

    // Function to get details of a specific stake on an issue
    function getStakeDetails(uint issueId, uint stakeIndex) public view returns (Stake memory) {
        return stakes[issueId][stakeIndex];  // Return the Stake struct for the given issue ID and stake index
    }

    // Function to get the earnings of a specific user
    function getEarnings(address user) public view returns (uint256) {
        return earnings[user];  // Return the earnings for the given user address
    }
}
