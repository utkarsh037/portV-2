import React, { useState, useEffect } from 'react';
import './NasaAPOD.css';

function NasaAPOD() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NASA API endpoint for APOD
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=gMhzRG1l3VlleOcpoxT7kNMsnd6Ycfb63YdKYeGb`;

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        const data = await response.json();
        setApodData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
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
      <h1 className="about-heading">Fuelled by my love for space, quantum physics, and astronomy, here’s today’s captivating NASA Picture of the Day.</h1>

      <h1>Astronomy Picture of the Day</h1>
      <h2>{apodData.title}</h2>
      <p>{apodData.explanation}</p>
      {apodData.media_type === 'image' ? (
        <img src={apodData.url} alt={apodData.title} className="apod-image" />
      ) : (
        <iframe
          title="APOD Video"
          src={apodData.url}
          width="100%"
          height="500"
          frameBorder="0"
        ></iframe>
      )}
    </div>
  );
}

export default NasaAPOD;
