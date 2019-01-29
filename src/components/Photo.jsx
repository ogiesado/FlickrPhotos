import React from 'react';

import '../styles/Photo.scss';

export default function Photo() {
  return (
    <figure className="fp-photo">
      <a href="#f">
        <img
          className="fp-photo__image"
          src="https://images.unsplash.com/photo-1548495010-d6021ac17171?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
          alt="ALT TEXT"
        />
      </a>
      <figcaption className="fp-photo__title">
        Make tags clickable so they populate the search bar and make a search
      </figcaption>
      <div className="fp-photo__tags">
        <button className="fp-photo__tag">japan</button>
        <button className="fp-photo__tag">laos</button>
        <button className="fp-photo__tag">cats</button>
        <button className="fp-photo__tag">japan</button>
        <button className="fp-photo__tag">laos</button>
        <button className="fp-photo__tag">cats</button>
        <button className="fp-photo__tag">japan</button>
        <button className="fp-photo__tag">laos</button>
        <button className="fp-photo__tag">cats</button>
      </div>
      <div className="fp-photo__profile">
        <span className="fp-photo__username">smithseven</span>
        <span className="fp-photo__date">22/02/19</span>
      </div>
    </figure>
  );
}
