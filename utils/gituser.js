import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchGitHubUser = async (username) => {
  try {
    const userResponse = await axios.get(`${GITHUB_API_URL}/users/${username}`);
    const reposResponse = await axios.get(`${GITHUB_API_URL}/users/${username}/repos`, {
      params: {
        sort: 'updated', // Sort by most recently updated
        per_page: 5, // Fetch the top 5 repositories
      },
    });

    return {
      user: userResponse.data,
      repos: reposResponse.data,
    };
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
    return null;
  }
};
