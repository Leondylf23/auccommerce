import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import classes from './style.module.scss';
import ImageCarousel from './components/ImageCarousel';

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

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.itemTitle}>Item Detail {id}</h1>
      <div className={classes.contentContainer}>
        <div className={classes.leftSide}>
          <ImageCarousel imageDatas={imageDatastemp} />
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
