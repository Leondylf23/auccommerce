import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { setItemDetail } from './actions';
import { GET_ITEM_DETAIL } from './constants';

function* doGetItemData({ formData }) {
  yield put(setLoading(true));

  try {
    // yield call();
    const exampleData = {
      itemName: 'item test data',
      itemImages: [
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
      ],
      itemDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet sollicitudin libero, quis vulputate
      mauris. In porta dolor sollicitudin, faucibus lorem eget, cursus arcu. Donec at orci tincidunt, vulputate
      lacus eu, luctus leo. Nam sed scelerisque mauris, lacinia efficitur diam. Praesent vel interdum purus. Ut
      elementum dictum urna.`,
      startingPrice: 100000,
      highestBid: 320000,
      isLiveNow: true,
      startingTimer: 123300,
      timeRemaining: 1223032,
      livePeoples: [
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
      ],
    };

    yield put(setItemDetail(exampleData));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* itemDetailSaga() {
  yield takeLatest(GET_ITEM_DETAIL, doGetItemData);
}
