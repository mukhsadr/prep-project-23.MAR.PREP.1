import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import qs from "qs";

import "./recommender.css";

const Recommender = ({ city, weather }) => {
  const [songs, setSongs] = useState([]);

  const [currentSong, setCurrentSong] = useState(0);

  const clientId = "fa8c44b84bf34a6d9f7a16dfd6a5b740";
  const clientSecret = "17f6323c3cac4b218aa9040cdc0f194e";

  const auth_token = Buffer.from(
    `${clientId}:${clientSecret}`,
    "utf-8"
  ).toString("base64");

  const getAuth = async () => {
    try {
      const token_url = "https://accounts.spotify.com/api/token";
      const data = qs.stringify({ grant_type: "client_credentials" });

      const response = await axios.post(token_url, data, {
        headers: {
          Authorization: `Basic ${auth_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.log(error);
    }
  };

  const spotifyRecommendationURI = `https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical&seed_tracks=0c6xIDDpzE81m2q797ordA&limit=10`;

  const getRecommendations = async () => {
    const access_token = await getAuth();

    const response = await axios.get(spotifyRecommendationURI, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log(response.data.tracks);

    const tracks = response.data.tracks;

    tracks.forEach((track, key) => {
      const trackObj = {
        num: key,
        albumId: track.album.id,
        artist: track.artists[0].name,
        albumName: sliceAlbum(track.album.name),
        coverImg: track.album.images[0].url,
      };
      setSongs((songs) => [...songs, trackObj]);
    });
  };

  useEffect(() => {
    getRecommendations();
  }, []);

  const sliceAlbum = (album) => {
    if (album.indexOf("(") !== -1) {
      const newAlbumName = album.substring(0, album.indexOf("("));
      return newAlbumName;
    } else {
      return album;
    }
  };

  const nextHandler = () => {
    if (currentSong + 1 === songs.length) {
      setCurrentSong(0);
    } else {
      setCurrentSong((currentSong) => currentSong + 1);
    }
  };

  const prevHandler = () => {
    if (currentSong === 0) {
      setCurrentSong(songs.length - 1);
    } else {
      setCurrentSong((currentSong) => currentSong - 1);
    }
  };

  const albumRef = useRef();

  const [x, setX] = useState();
  const [y, setY] = useState();

  function getPosition(el) {
    var rect = el.current.getBoundingClientRect();
    setX(rect.left);
    setY(rect.top);
  }

  useEffect(() => {
    if (albumRef.current) {
      getPosition(albumRef);
    }
  }, [albumRef.current]);

  return (
    <div>
      <h2>Recommended Songs</h2>
      {songs.length !== 0 ? (
        <>
          <div className="recommendations">
            <div className="hero-img">
              <img
                className="album-cover"
                src={songs[currentSong].coverImg}
                alt="album-cover"
              />
            </div>
            <div className="emblem-container">
              <div className="emblem text"></div>
            </div>
            <div className="song-num">
              <span>{songs[currentSong].num + 1}</span>
            </div>
            <div ref={albumRef} className="album-name">
              <span>{songs[currentSong].albumName}</span>
            </div>
            <div className="artist-name">
              <span>{songs[currentSong].artist}</span>
            </div>
          </div>
          <div className="spotify-widget">
            <iframe
              src={`https://open.spotify.com/embed/album/${songs[currentSong].albumId}?utm_source=generator`}
              width="100%"
              height="80"
              frameBorder={0}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
          <div className="button-container">
            <button onClick={prevHandler} className="scroll-left nav-arrow">
              <span></span>Prev
            </button>
            <button className="scroll-right nav-arrow" onClick={nextHandler}>
              Next<span></span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Recommender;
