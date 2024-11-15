import PropTypes from 'prop-types';

/**
 * Utility function to append query parameters to a URL.
 * It ensures that existing query parameters are preserved.
 */
const appendQueryParam = (url, param, value) => {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(param, value);
    return urlObj.toString();
  } catch (error) {
    console.error('Invalid URL:', url);
    return url; // Fallback to original URL if invalid
  }
};

const VideoBlock = ({ src, autoPlay, title = 'Embedded Video' }) => {
  // Determine the correct autoplay parameter based on the platform
  // This example assumes YouTube; adjust accordingly for other platforms
  let autoplaySrc = src;

  if (autoPlay) {
    // Check if the URL is from YouTube or Vimeo and set parameters accordingly
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      autoplaySrc = appendQueryParam(src, 'autoplay', '1');
    } else if (src.includes('vimeo.com')) {
      autoplaySrc = appendQueryParam(src, 'autoplay', '1');
      autoplaySrc = appendQueryParam(autoplaySrc, 'muted', '1');
    } else {
      // For other platforms, append autoplay=1 if supported
      autoplaySrc = appendQueryParam(src, 'autoplay', '1');
    }
  }

  return (
    <iframe
      src={autoplaySrc}
      title={title}
      style={{ width: '100%', height: '100%' }}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    >
      {/* Fallback content for browsers that do not support iframes */}
      Your browser does not support the iframe element.
    </iframe>
  );
};

VideoBlock.propTypes = {
  src: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  title: PropTypes.string,
};

VideoBlock.defaultProps = {
  autoPlay: false,
  title: 'Embedded Video',
};

export default VideoBlock;
