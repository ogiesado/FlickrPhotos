import React, { Component, Fragment } from 'react';
import SearchBar from './SearchBar';
import Photos from './Photos';
import Message from './Message';
import {
  getPhotosForTag,
  isUndefined,
  isEmptyString,
  debounce
} from '../utils';
import {
  SEARCHING_PHOTOS_MESSAGE,
  ENTER_SEARCH_MESSAGE,
  NO_PHOTOS_MESSAGE
} from '../constants';

import '../styles/FlickrPhotos.scss';

export default class FlickrPhotos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: '',
      page: 0,
      groupedPhotos: [],
      hasPhotos: false,
      hasMorePhotos: false,
      numberOfPhotoGroups: 4,
      loadMorePhotosScrollPosition: Infinity,
      message: ENTER_SEARCH_MESSAGE,
      loading: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  componentWIllunmount() {
    window.removeEventListener('scroll', this.handleWindowScroll);
  }

  /**
   * Fetch photos for the current tag and next page
   * @return {Promise}
   */
  fetchPhotos = () => {
    const { tag, page } = this.state;

    return getPhotosForTag(tag, page + 1).then(
      ({ photos, hasPhotos, hasMorePhotos, page }) => {
        this.setState({
          page,
          hasPhotos,
          hasMorePhotos,
          groupedPhotos: this.groupPhotos(photos)
        });

        if (!hasPhotos) {
          throw new Error(NO_PHOTOS_MESSAGE);
        }
      }
    );
  };

  /**
   * Groups photos for each photo column
   * @param {Array} photos
   * @return {Array<Array>}
   */
  groupPhotos = photos => {
    const { numberOfPhotoGroups, groupedPhotos } = this.state;
    let currentPhotoGroup = 0;

    return photos.reduce(
      (groupedPhotos, photo) => {
        if (isUndefined(groupedPhotos[currentPhotoGroup])) {
          groupedPhotos[currentPhotoGroup] = [];
        }

        groupedPhotos[currentPhotoGroup].push(photo);

        currentPhotoGroup++;

        if (currentPhotoGroup === numberOfPhotoGroups) {
          currentPhotoGroup = 0;
        }

        return groupedPhotos;
      },
      [...groupedPhotos]
    );
  };

  /**
   * Show loading
   * @return {void}
   */
  showLoading = () => this.setState({ loading: true });

  /**
   * Hide loading
   * @return {void}
   */
  hideLoading = () => this.setState({ loading: false });

  /**
   * Show a message
   * @param {String} message
   * @return {void}
   */
  showMessage = message => this.setState({ message });

  /**
   * Hide the current message
   * @return {void}
   */
  removeMessage = () => this.setState({ message: '' });

  /**
   * Handles the tag change event
   * @param {Event} e
   * @return {void}
   */
  handleTagChange = e => this.searchForTag(e.target.value);

  /**
   * Sets an searches for a tag
   * @param {String} tag
   * @return {void}
   */
  searchForTag = tag => {
    this.setState({ tag });
    this.searchPhotos();
  };

  /**
   * Handles the window scroll event
   * @return {void}
   */
  handleWindowScroll = debounce(() => {
    const { loadMorePhotosScrollPosition, hasMorePhotos } = this.state;
    if (hasMorePhotos && loadMorePhotosScrollPosition <= window.scrollY) {
      this.setState({ loadMorePhotosScrollPosition: Infinity });
      this.fetchPhotos();
    }
  }, 0.4);

  /**
   * Searches for photos and handles the loading indcator and messages
   * @return {void}
   */
  searchPhotos = debounce(() => {
    if (isEmptyString(this.state.tag)) {
      this.reset(ENTER_SEARCH_MESSAGE);
      return;
    }

    this.showMessage(SEARCHING_PHOTOS_MESSAGE);
    this.showLoading();

    this.setState({
      page: 0,
      groupedPhotos: [],
      loadMorePhotosScrollPosition: Infinity
    });

    this.fetchPhotos()
      .then(this.removeMessage)
      .catch(({ message }) => {
        this.showMessage(message);
      })
      .then(this.hideLoading);
  }, 0.7);

  /**
   * Checks if the are more photos for the current tag
   * @return {Boolean}
   */
  hasMorePhotos = () => this.state.hasMorePhotos;

  /**
   * Resets common state values
   * @return {void}
   */
  reset = (message = ENTER_SEARCH_MESSAGE) => {
    this.setState({
      message,
      tag: '',
      page: 0,
      groupedPhotos: [],
      numberOfPhotoGroups: 4,
      loadMorePhotosScrollPosition: Infinity,
      loading: false
    });
  };

  /**
   * Sets the position to trigger loading more photos
   * @return {void}
   */
  setLoadMorePhotosScrollPosition = position => {
    this.setState({
      loadMorePhotosScrollPosition: position - window.innerHeight
    });
  };

  render() {
    const { tag, loading, message, groupedPhotos } = this.state;

    return (
      <Fragment>
        <header className="fp__header">
          <div className="fp__header-container">
            <h2 className="fp__logo">FP</h2>
            <SearchBar value={tag} onChange={this.handleTagChange} />
          </div>
        </header>
        <section className="fp__body">
          <main className="fp__content">
            <Message text={message} loading={loading} />
            <Photos
              photoGroups={groupedPhotos}
              searchForTag={this.searchForTag}
              setLoadMorePhotosScrollPosition={
                this.setLoadMorePhotosScrollPosition
              }
            />
          </main>
        </section>
      </Fragment>
    );
  }
}
