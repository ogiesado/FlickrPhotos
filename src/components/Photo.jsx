import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/Photo.scss';

export default class Photo extends Component {
  static propTypes = {
    pageUrl: PropTypes.string,
    photoUrl: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    owner: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    tags: PropTypes.array,
    searchForTag: PropTypes.func
  };

  render() {
    const {
      pageUrl,
      photoUrl,
      tags,
      title,
      date,
      height,
      onwner,
      backgroundColor,
      searchForTag
    } = this.props;

    return (
      <figure className="fp-photo">
        <a
          href={pageUrl}
          target="_blank"
          className="fp-photo__link"
          style={{ backgroundColor, height: `${height}px` }}
        >
          <img className="fp-photo__image" src={photoUrl} alt={title} />
        </a>
        <figcaption className="fp-photo__title">{title}</figcaption>
        <div className="fp-photo__tags">
          {tags.map(tag => (
            <button
              key={tag}
              className="fp-photo__tag"
              title={tag}
              onClick={() => searchForTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="fp-photo__profile">
          <span className="fp-photo__username">{onwner}</span>
          <span className="fp-photo__date">{date}</span>
        </div>
      </figure>
    );
  }
}
