import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Photo from './Photo';

import '../styles/Photos.scss';

export default class Photos extends Component {
  static propTypes = {
    photoGroups: PropTypes.array,
    searchForTag: PropTypes.func,
    setLoadMorePhotosScrollPosition: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.photosRef = createRef();
  }

  calculateLoadMorePhotosScrollPosition = () => {
    let topMostLastPhotoScrollPosition = 0;
    const { setLoadMorePhotosScrollPosition } = this.props;

    Array.from(this.photosRef.current.children).forEach(groupElement => {
      if (groupElement.lastElementChild !== null) {
        const { top } = groupElement.lastElementChild.getBoundingClientRect();
        if (
          topMostLastPhotoScrollPosition === 0 ||
          topMostLastPhotoScrollPosition > top
        ) {
          topMostLastPhotoScrollPosition = Math.round(top);
        }
      }
    });

    setLoadMorePhotosScrollPosition(topMostLastPhotoScrollPosition);
  };

  componentDidMount() {
    this.calculateLoadMorePhotosScrollPosition();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.photoGroups !== this.props.photoGroups) {
      this.calculateLoadMorePhotosScrollPosition();
    }
  }

  render() {
    const { photoGroups = [] } = this.props;
    return (
      <div className="fp-photos" ref={this.photosRef}>
        {photoGroups.map((group, index) => (
          <div key={index} className="fp-photos__group">
            {group.map(photo => (
              <Photo
                key={photo.id}
                searchForTag={this.props.searchForTag}
                {...photo}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
