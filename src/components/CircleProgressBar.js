import React, { useState, useEffect } from 'react';

function CircleProgressBar({ percentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const finalDashoffset = circumference - (percentage / 100) * circumference;

  const [dashoffset, setDashoffset] = useState(circumference);

  useEffect(() => {
    // This timeout gives a delay to let the browser re-render before starting the animation.
    const timeout = setTimeout(() => {
      setDashoffset(finalDashoffset);
    }, 10);

    return () => clearTimeout(timeout); // Cleanup timeout in case of unmounting
  }, [finalDashoffset]);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#eee" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#007BFF"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        style={{
          transition: 'stroke-dashoffset 1s ease-in-out', // You can adjust timing here
        }}
      />
      <text x="60" y="60" fontSize="24" fill="#007BFF" textAnchor="middle" dy="8">
        {percentage}
      </text>
    </svg>
  );
}

export default CircleProgressBar;
