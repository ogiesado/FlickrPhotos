import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { isEmptyString } from '../utils';

import '../styles/Message.scss';

export default function Message({ text = '', loading = false }) {
  return !isEmptyString(text) || loading ? (
    <Fragment>
      <div className="fp-message">
        {!isEmptyString(text) && <p className="fp-message__text">{text}</p>}
        {loading && <Loading />}
      </div>
    </Fragment>
  ) : null;
}

Message.propType = {
  text: PropTypes.string,
  loading: PropTypes.bool
};
