import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import classes from '../style.module.scss';

const ImageCarousel = ({ imageDatas = [] }) => {
  const [activeImageUrl, setActiveImageUrl] = useState(imageDatas[0] || '');
  const [activeIndex, setActiveIndex] = useState(0);
  const [opacityZero, setOpacityZero] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const changeImage = (img, idx) => {
    if (idx === activeIndex) return;

    setOpacityZero(true);
    setActiveIndex(idx);

    if (timeoutId) clearTimeout(timeoutId);

    setTimeoutId(
      setTimeout(() => {
        setActiveImageUrl(img);
        setOpacityZero(false);
        setTimeoutId(null);
      }, 150)
    );
  };

  useEffect(() => {
    const intervalData = setInterval(() => {
      setActiveIndex((prevVal) => {
        const nextIndex = prevVal + 1 > imageDatas.length - 1 ? 0 : prevVal + 1;
        const nextImg = imageDatas[nextIndex];

        changeImage(nextImg, nextIndex);
        return nextIndex;
      });
    }, 10000);

    return () => {
      if (intervalData) clearInterval(intervalData);
    };
  }, []);

  return (
    <div className={classes.imageCarouselContainer}>
      <div className={classes.activeImgContainer}>
        <img className={classes.activeImg} src={activeImageUrl} alt={activeImageUrl} data-zero-op={opacityZero} />
      </div>
      <div className={classes.imageSelector}>
        {imageDatas?.map((image, index) => (
          <div className={classes.item} key={index} onClick={() => changeImage(image, index)}>
            <img className={classes.data} src={image} alt={image} data-active={index === activeIndex} />
          </div>
        ))}
      </div>
    </div>
  );
};

ImageCarousel.propTypes = {
  imageDatas: PropTypes.array,
};

export default ImageCarousel;
