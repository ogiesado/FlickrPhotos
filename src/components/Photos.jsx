import React from 'react';
import PropTypes from 'prop-types';
import Photo from './Photo';

import '../styles/Photos.scss';

export default function Photos({ columns = [] } = {}) {
  return (
    <div className="fp-photos">
      <Photo />
      <Photo />
      <Photo />
      <Photo />
    </div>
  );
}

Photos.propTypes = {
  columns: PropTypes.array
};
