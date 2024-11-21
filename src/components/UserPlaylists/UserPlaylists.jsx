import "./UserPlaylists.css";
import React, { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import SongCard from "../SongCard/SongCard";

const UserPlaylists = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // to add a limit, add => ?limit=10
        const response = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPlaylists(data.items); // store the playlists in state
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    if (accessToken) {
      fetchPlaylists();
    }
  }, [accessToken]); // re-runs useEffect function when accessToken changes

  // Playlist click to fetch the tracks

  const playlistClick = async (playlistId) => {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setTracks(data.items);
    setSelectedPlaylist(playlistId);
  };

  const backToPlaylists = () => {
    setSelectedPlaylist(null); // reset the selected playlist to show playlists again
    setTracks([]); // clear the tracks
  };

  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="userPlaylist"
            />
            <span>{playlist.name}</span>
          </li>
        ))}
      </ul>
      <h2>New Releases</h2>
      <ul>
        {newReleases.map((item) => (
          <li key={item.id}>
            <img
              src={item.images[0]?.url}
              alt={item.name}
              className="userPlaylist"
            />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPlaylists;
