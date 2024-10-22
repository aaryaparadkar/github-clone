'use client'

import React, { useEffect, useState } from 'react';

const Resume = () => {
  const [userData, setUserData] = useState(null);
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const gitToken = localStorage.getItem('githubAccessToken');
        if (!gitToken) {
          console.error('GitHub access token not found.');
          return;
        }

        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${gitToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        // Fetch additional data (stars, organizations, etc.)
        const orgsResponse = await fetch(data.organizations_url, {
          headers: {
            Authorization: `Bearer ${gitToken}`,
          },
        });
        const orgsData = await orgsResponse.json();

        const starsResponse = await fetch(
          `https://api.github.com/users/${data.login}/starred`,
          {
            headers: {
              Authorization: `Bearer ${gitToken}`,
            },
          }
        );
        const starsData = await starsResponse.json();

        setUserData({
          ...data,
          organizations: orgsData,
          stars: starsData.length,
        });

        // Fetch pinned repositories using GraphQL
        const pinnedReposQuery = `
          query {
            user(login: "${data.login}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                    description
                    stargazers {
                      totalCount
                    }
                    forks {
                      totalCount
                    }
                    url
                  }
                }
              }
            }
          }
        `;

        const graphqlResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${gitToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: pinnedReposQuery }),
        });

        const graphqlData = await graphqlResponse.json();
        setPinnedRepos(graphqlData.data.user.pinnedItems.nodes);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, []);

  // Function to calculate the years on GitHub
  const calculateGitHubAge = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMilliseconds = currentDate - createdDate;
    const yearsOnGitHub = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365)); // Convert to years
    return yearsOnGitHub;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='flex items-start justify-center flex-row p-10 gap-4'>
        <div className='p-2'>
          <h1 className='text-2xl'>{userData.name}</h1>
          <img src={userData.avatar_url} alt={`${userData.login}'s avatar`} className='rounded-full size-60 mt-4' />
          <p className=''>Bio: {userData.bio}</p>
          <p className=''>Location: {userData.location}</p>
          <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p>Followers: {userData.followers}</p>
          </div>
          <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p>Following: {userData.following}</p>
          </div>

          <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <p>Repos: {userData.public_repos}</p>
          </div>

          <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>

            <p>Repos: {userData.total_private_repos}</p>
          </div>

          <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.588 0l-4.726 2.885a.562.562 0 0 1-.839-.61l1.285-5.385a.563.563 0 0 0-.182-.557L2.46 10.385c-.38-.325-.178-.948.321-.988l5.518-.442a.562.562 0 0 0 .475-.345l2.125-5.111Z" />
            </svg>
            <p>{userData.stars}</p>
          </div>

          <div className='flex gap-2'>
            <p>GitHub Age: {calculateGitHubAge(userData.created_at)} years</p>
          </div>
        </div>

        <div className=''>
          <h1 className='text-2xl'>Pinned repositories:</h1>
          <ul>
            {pinnedRepos.map((repo) => (
              <li key={repo.url} className='my-2 border-[1px] border-blue-500 p-3'>
                <a href={repo.url} target='_blank' className='text-lg font-semibold text-blue-500'>
                  {repo.name}
                </a>
                <p>{repo.description}</p>
                <p>Stars: {repo.stargazers.totalCount} | Forks: {repo.forks.totalCount}</p>
              </li>
            ))}
          </ul>
          <div>
          <img
            src={`https://ghchart.rshah.org/${userData.login}`}
            alt={`${userData.login}'s Github chart`}
            className='mt-4'
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
