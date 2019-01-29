import React from 'react';

import '../styles/SearchBar.scss';

export default function SearchBar() {
  return (
    <div className="fp-search-bar">
      <input className="fp-search-bar__input" placeholder="Search" />
    </div>
  );
}
