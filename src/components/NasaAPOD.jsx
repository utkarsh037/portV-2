import React, { useState, useEffect } from 'react';
import './NasaAPOD.css';

function NasaAPOD() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=sXtE1Kob8aZ2ytd718SXw5MEGIXhlMySRZmuxywM`;

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const response = await fetch(apiUrl, { mode: 'cors' });
        if (!response.ok) {
          const errBody = await response.json();
          throw new Error(errBody.error?.message || `HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setApodData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="nasa-apod">
      <h1 className="about-heading">
        Fuelled by my love for space, quantum physics, and astronomy, here's today's captivating NASA Picture of the Day.
      </h1>

      <h1>Astronomy Picture of the Day</h1>
      <h2>{apodData.title}</h2>
      <p className="apod-date">{apodData.date}</p>
      <p className="apod-explanation">{apodData.explanation}</p>

      {apodData.media_type === 'image' ? (
        <img
          src={apodData.hdurl || apodData.url}
          alt={apodData.title}
          className="apod-image"
        />
      ) : (
        <iframe
          title="APOD Video"
          src={apodData.url}
          width="100%"
          height="500"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}

      {apodData.copyright && (
        <p className="apod-copyright">© {apodData.copyright}</p>
      )}
    </div>
  );
}

export default NasaAPOD;