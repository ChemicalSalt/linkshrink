import React from 'react';
import UrlShortener from './UrlShortener';
import './App.css';

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">LinkShrink</h1>
        <p className="subtitle">Shorten your long URLs in seconds!</p>
      </header>
      <UrlShortener />
    </div>
  );
}
