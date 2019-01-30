import React, { Component, Fragment } from 'react';
import SearchBar from './SearchBar';
import Photos from './Photos';
import Message from './Message';
import { getPhotosForTag } from '../utils';

import '../styles/FlickrPhotos.scss';

export default class FlickrPhotos extends Component {
  componentDidMount() {
    console.log('did mount');
    getPhotosForTag('cat');
  }

  render() {
    return (
      <Fragment>
        <header className="fp-header">
          <h2 className="fp-logo">FP</h2>
          <SearchBar />
        </header>
        <section className="fp-body">
          <main className="fp-content">
            <Photos />
            <Message />
          </main>
        </section>
      </Fragment>
    );
  }
}
