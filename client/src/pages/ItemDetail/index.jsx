import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import TimerIcon from '@mui/icons-material/Timer';

import { formatTimeOnly, numberWithPeriods, timerDisplay } from '@utils/allUtils';
import ImageCarousel from './components/ImageCarousel';

import classes from './style.module.scss';
import { useState } from 'react';
import LivePeoplesDisplay from './components/LivePeoplesDisplay';

const ItemDetail = ({ itemDetailData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const imageDatastemp = [
    'https://d2kwwar9pcd0an.cloudfront.net/6b9a7820fd8161e906f76e45aa152f00.jpeg',
    'https://d2kwwar9pcd0an.cloudfront.net/92888dd36adfdc9c59a34f21af908f95.jpeg',
    'https://d2kwwar9pcd0an.cloudfront.net/5c6e598bdd7799c2cdef4120c752dce3.jpeg',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-4-attatchments-wp2586787-wallpaper-minecraft.jpg',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-no%20effects.png',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-1-attatchments-path%20tracing.png',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-Screenshot%202023-09-13%20013302.png',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-2-attatchments-38070402-03d5-4227-b973-45a2438e39d4.jpg',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-alex_rainer-jVjlBQg-Gj8-unsplash.jpg',
    'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
  ];
  const peoples = [
    {
      id: 'dwadw',
      image: 'https://d2kwwar9pcd0an.cloudfront.net/6b9a7820fd8161e906f76e45aa152f00.jpeg',
    },
    {
      id: 'dwadwa',
      image: 'https://d2kwwar9pcd0an.cloudfront.net/5c6e598bdd7799c2cdef4120c752dce3.jpeg',
    },
    {
      id: 'dwadw1',
      image: 'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-no%20effects.png',
    },
    {
      id: 'dwad',
      image: 'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-no%20effects.png',
    },
    {
      id: '123adw1',
      image:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-alex_rainer-jVjlBQg-Gj8-unsplash.jpg',
    },
    {
      id: 'dasd22',
      image:
        'https://krustorage.blob.core.windows.net/kru-public-master-blob/post-0-attatchments-IMG_20230905_135946.jpg',
    },
  ];

  const [livePeoples, setLivePeoples] = useState(peoples);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.contentContainer}>
        <div className={classes.leftSide}>
          <ImageCarousel imageDatas={imageDatastemp} />
        </div>
        <div className={classes.rightSide}>
          <h1 className={classes.itemName}>Test item</h1>
          <div className={classes.bidPriceContainer}>
            <div className={classes.priceContainer}>
              <h3 className={classes.title}>Starting Price</h3>
              <p className={classes.price}>Rp. {numberWithPeriods(10000)}</p>
            </div>
            <div className={classes.priceContainer}>
              <h3 className={classes.title}>Highest Bid</h3>
              <p className={classes.price}>Rp. {numberWithPeriods(10000)}</p>
            </div>
          </div>
          <div className={classes.timerContainer}>
            <div className={classes.leftContainer}>
              <TimerIcon className={classes.icon} />
              <p className={classes.timer}>{timerDisplay(1000000)}</p>
            </div>
            <div className={classes.rightContent}>
              <LivePeoplesDisplay peoples={livePeoples} />
            </div>
          </div>
          <button>
            
          </button>
          <p className={classes.itemDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet sollicitudin libero, quis vulputate
            mauris. In porta dolor sollicitudin, faucibus lorem eget, cursus arcu. Donec at orci tincidunt, vulputate
            lacus eu, luctus leo. Nam sed scelerisque mauris, lacinia efficitur diam. Praesent vel interdum purus. Ut
            elementum dictum urna.
          </p>
        </div>
      </div>
    </div>
  );
};

ItemDetail.propTypes = {
  itemDetailData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(ItemDetail);
