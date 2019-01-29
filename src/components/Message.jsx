import React, { Fragment } from 'react';
import Loading from './Loading';

import '../styles/Message.scss';

export default function Message({ text }) {
  return (
    <Fragment>
      <div className="fp-message">
        <p className="fp-message__text">Enter a tag to see photos!</p>
      </div>
      <div className="fp-message">
        <p className="fp-message__text">
          Sorry, your tag did not return any results.
        </p>
      </div>
      <div className="fp-message">
        <p className="fp-message__text">Searching photos for your tag...</p>
        <Loading />
      </div>
    </Fragment>
  );
}
