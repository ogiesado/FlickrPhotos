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
    extras: 'date_taken,owner_name,tags,url_m'
  };

  return flickrApi('search', extraParams).then(
    ({ photos: { perpage, page, pages, photo: photos } } = {}) => {
      return transformPhotos(photos);
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
    return {
      title: photo.title,
      tags: photo.tags.split(' '),
      url: `${FLICKR_PHOTO_URL}/${photo.owner}/${photo.id}`,
      onwner: photo.ownername,
      height: photo.height_m,
      width: photo.width_m,
      date: new Date(photo.datetaken).toLocaleDateString()
    };
  });
}
