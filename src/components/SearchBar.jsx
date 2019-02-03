import React from 'react';
import PropTypes from 'prop-types';
import { preventSpaceKey, removeSpacesFromClipboardText } from '../utils';

import '../styles/SearchBar.scss';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="fp-search-bar">
      <input
        className="fp-search-bar__input"
        placeholder="Search"
        value={value}
        onChange={onChange}
        onKeyDown={preventSpaceKey}
        onPaste={removeSpacesFromClipboardText}
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};
