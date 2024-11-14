import PropTypes from 'prop-types';

const VideoBlock = ({ src, autoPlay }) => {
  return (
    <iframe
      src={`${src}${autoPlay ? '?autoplay=1' : ''}`}
      title="Embedded Video"
      style={{ width: '100%', height: '100%' }}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  );
};

VideoBlock.propTypes = {
  src: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool.isRequired,
};

export default VideoBlock;
