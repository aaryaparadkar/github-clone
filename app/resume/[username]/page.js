import { fetchGitHubUser } from '../lib/github';

export default function UserProfile({ userData }) {
  if (!userData) {
    return <p>User not found or an error occurred.</p>;
  }

  const { user, repos } = userData;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{user.name} ({user.login})</h1>
      <img src={user.avatar_url} alt={user.name} width={100} style={{ borderRadius: '50%' }} />
      <p>{user.bio}</p>
      <p>Followers: {user.followers} | Following: {user.following}</p>
      <h2>Top Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a> - {repo.stargazers_count} stars
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;
  const userData = await fetchGitHubUser(username);

  return {
    props: {
      userData,
    },
  };
}
