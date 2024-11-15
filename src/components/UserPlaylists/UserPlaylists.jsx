import './UserPlaylists.css';
import React, { useEffect, useState } from 'react';

const UserPlaylists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=5", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setPlaylists(data.items);

      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    const fetchNewReleases = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=5", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNewReleases(data.albums.items);

      } catch (error) {
        console.error('Error fetching new releases:', error);
      }
    };

    if (accessToken) {
      fetchPlaylists();
      fetchNewReleases();
      console.log(playlists)
    }
  }, [accessToken]); // re-runs useEffect function when accessToken changes

  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <span>{playlist.name}</span>
          </li>
        ))}
      </ul>
      <h2>New Releases</h2>
      <ul>
        {newReleases.map((item) => (
          <li key={item.id}>
            <img src={item.images[0]?.url} alt={item.name} className='playlist'/>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPlaylists;