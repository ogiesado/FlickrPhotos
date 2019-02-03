import {
  FLICKR_API_KEY,
  FLICKR_API_URL,
  PHOTOS_PER_PAGE,
  FLICKR_PHOTO_URL,
  FLICKR_API_STAT_SUCCESS
} from './constants';

/**
 * Returns photos for a tag
 * @param {String} tag The tag to return search results for
 * @param {Number} page The page to return search for
 * @return {Promise}
 */
export function getPhotosForTag(tag, page = 1) {
  const extraParams = {
    page,
    tags: tag,
    per_page: PHOTOS_PER_PAGE,
    media: 'photos',
    extras: 'date_taken,owner_name,tags,url_n,url_m'
  };

  return flickrApi('search', extraParams).then(
    ({ photos: { perpage, page, pages, photo: photos } } = {}) => {
      return {
        page,
        hasPhotos: photos.length > 0,
        hasMorePhotos: page < pages,
        photos: transformPhotos(photos)
      };
    }
  );
}

/**
 * A helper to make Flickr API calls
 * @param {String} enpoint The Flickr API method end part
 * @param {Object} [extraParams={}] Exytra parameters to send to the endpoint
 * @return {Promise}
 */
export function flickrApi(endpoint, extraParams = {}) {
  const params = { ...getDefaultFlickrParams(endpoint), ...extraParams };
  const url = `${FLICKR_API_URL}/?${serailiazeParams(params)}`;

  return fetch(url)
    .then(response => response.json())
    .then(({ stat, message, code = null, ...data }) => {
      if (stat !== FLICKR_API_STAT_SUCCESS) {
        throw new Error(message);
      }

      return data;
    });
}

/**
 * A helper to generate default Flickr params
 * @param {String} endpoint
 * @return {Object}
 */
function getDefaultFlickrParams(endpoint) {
  return {
    format: 'json',
    nojsoncallback: 1,
    method: `flickr.photos.${endpoint}`,
    api_key: FLICKR_API_KEY
  };
}

/**
 * Helps serialize objects to query strings
 * @param {Object} object The object to serialize
 * @return {String}
 */
function serailiazeParams(object) {
  return Object.keys(object)
    .reduce((param, k) => {
      param.push(encodeURIComponent(k) + '=' + encodeURIComponent(object[k]));
      return param;
    }, [])
    .join('&');
}

/**
 * Transforms the Flickr photos to the desired format
 * @param {Array<Object>} [photos=[]]
 * @return {Array<Object>} The formatted photo objects
 */
function transformPhotos(photos = []) {
  return photos.map(photo => {
    const sizeSuffix = !isUndefined(photo.url_n) ? 'n' : 'm';

    return {
      id: photo.id,
      title: photo.title,
      tags: photo.tags.split(' '),
      pageUrl: `${FLICKR_PHOTO_URL}/${photo.owner}/${photo.id}`,
      photoUrl: photo[`url_${sizeSuffix}`],
      onwner: photo.ownername,
      height: Number(photo[`height_${sizeSuffix}`]),
      width: Number(photo[`width_${sizeSuffix}`]),
      date: new Date(photo.datetaken).toLocaleDateString(),
      backgroundColor: getRandomImagePlaceHolderColour()
    };
  });
}

/**
 * Checks if a value is undefined
 * @param {any} value
 * @return {Boolean}
 */
export function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * Checks if an string is empty
 * @param {String} string
 * @return {Boolean}
 */
export function isEmptyString(string) {
  return string.length === 0;
}

/**
 * A helper to debounce function calls
 * @param {Function} fn The function to debounce
 * @param {Number} waitTimeInSeconds The time in seconds to wait
 * @return {Function} The debounced function
 */
export function debounce(fn, waitTimeInSeconds) {
  let timeout = null;

  waitTimeInSeconds = waitTimeInSeconds * 1000;

  return function debounced(...args) {
    const callback = () => {
      fn(...args);
      timeout = null;
    };

    if (timeout === null) {
      timeout = setTimeout(callback, waitTimeInSeconds);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(callback, waitTimeInSeconds);
    }
  };
}

/**
 * Prevents the space character on keyboard event
 * @param {Event}
 * @return {void}
 */
export function preventSpaceKey(event) {
  if (event.keyCode === 32) {
    event.preventDefault();
  }
}

/**
 * Removes space characters from the clipboard text when apsting
 * @param {Event}
 * @return {void}
 */
export function removeSpacesFromClipboardText(event) {
  event.preventDefault();

  let clipboardText = (event.clipboardData || window.clipboardData).getData(
    'text'
  );

  clipboardText = clipboardText.replace(/\s/gi, '');

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  ).set;
  nativeInputValueSetter.call(event.target, clipboardText);

  event.target.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * A helper to get a random background colour for the photos
 * @return {String}
 */
function getRandomImagePlaceHolderColour() {
  const colours = [
    '#9a6324',
    '#ffd8b1',
    '#fffac8',
    '#008080',
    '#808080',
    '#46f0f0',
    '#808000',
    '#e6beff',
    '#fffac8'
  ];

  return colours[getRandomInteger(colours.length)];
}

/**
 * A helper to get a random postive integer
 * @param {Number} max
 * @return {Number}
 */
function getRandomInteger(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
