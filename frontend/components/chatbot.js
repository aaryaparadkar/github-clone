import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

  // Function to fetch GitHub username using the access token
  const fetchGithubUsername = async () => {
    try {
      const token = localStorage.getItem('githubAccessToken');
      if (token) {
        const response = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGithubUsername(response.data.login); // GitHub username is in the 'login' field
      }
    } catch (error) {
      console.error('Error fetching GitHub username', error);
    }
  };

  // Fetch the GitHub username on component mount
  useEffect(() => {
    fetchGithubUsername();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { type: 'user', text: input };
    setMessages([...messages, newMessage]);

    const responseMessage = { type: 'bot', text: 'Fetching response...' };
    setMessages((prevMessages) => [...prevMessages, responseMessage]);

    try {
      const apiResponse = await determineApiCall(input);
      const structuredResponse = structureResponse(apiResponse);

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = { type: 'bot', text: structuredResponse };
        return newMessages;
      });
    } catch (error) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = { type: 'bot', text: 'Error fetching data.' };
        return newMessages;
      });
    }

    setInput('');
  };

  const structureResponse = (apiResponse) => {
    if (Array.isArray(apiResponse)) {
      // Check if this is a tech stack or ranking response
      if (apiResponse.length > 0 && apiResponse[0].hasOwnProperty('language')) {
        // Tech Stack Response
        return apiResponse
          .map((item) => {
            if (item.language) {
              return `Language: ${item.language}, Score: ${item.score || 'N/A'}`;
            } else if (item.framework) {
              return `Framework: ${item.framework}, Count: ${item.count || 'N/A'}`;
            } else {
              return `Repo: ${item.name}, URL: ${item.html_url}, Description: ${item.description || 'No description available'}`;
            }
          })
          .join('\n') || 'No repo found';
      } else if (apiResponse.length > 0 && apiResponse[0].hasOwnProperty('framework')) {
        // Framework Ranking Response
        return apiResponse.length
          ? apiResponse
              .map((item) => `Framework: ${item.framework}, Count: ${item.count || 'N/A'}`)
              .join('\n')
          : 'No repo found';
      }
    }
    return apiResponse || 'No data available';
  };

  const determineApiCall = async (input) => {
    const lowerInput = input.toLowerCase();
    let url = '';
    let response = null;

    if (lowerInput.startsWith('tech stack')) {
      const techStack = lowerInput.split('tech stack ')[1];
      url = `https://muj-gitstakeai.onrender.com/api/repoByStack/${techStack}`;
    } else if (lowerInput.startsWith('rank languages')) {
      url = `https://muj-gitstakeai.onrender.com/api/rankLangRepo/${githubUsername}`;
    } else if (lowerInput.startsWith('rank frameworks')) {
      url = `https://muj-gitstakeai.onrender.com/api/rankByFramework/${githubUsername}`;
    } else if (lowerInput.startsWith('issue priority')) {
      const repo = lowerInput.split('issue priority ')[1];
      const owner = githubUsername; // Use the fetched GitHub username for the owner
      url = `https://muj-gitstakeai.onrender.com/api/issuePriority/${owner}/${repo}`;
    }

    if (url) {
      response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('githubAccessToken')}`,
        },
      });
      return response.data;
    } else {
      return 'Unknown command.';
    }
  };

  return (
    <div style={{ maxHeight: 600 }} className="flex flex-col items-center h-screen p-2">
      <div className="w-full max-w-lg p-2 bg-black rounded-sm shadow-sm">
        <div className="h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-lg text-white ${message.type === 'user' ? 'bg-blue-500 self-end' : 'bg-gray-700 self-start'
                }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Our Chatbot will assist you..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
