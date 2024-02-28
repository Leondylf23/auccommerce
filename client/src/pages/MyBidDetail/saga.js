import { takeLatest, call, put } from 'redux-saga/effects';
import { setLoading, showPopup } from '@containers/App/actions';
import { getMyBidDetailApi } from '@domain/api';
import { setBidDetail } from './actions';
import { GET_BID_DETAIL } from './constants';

function* doGetBidDetail({ formData }) {
  yield put(setLoading(true));

  try {
    const res = yield call(getMyBidDetailApi, formData);
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
      winnerBid: {
        status: 'WAITING',
        paymentPrice: 133131,
        payUntil: '2024-02-29 00:00:00',
      },
    };

    yield put(setBidDetail(res?.data));
  } catch (error) {
    yield put(showPopup());
  }

  yield put(setLoading(false));
}

export default function* bidDetailSaga() {
  yield takeLatest(GET_BID_DETAIL, doGetBidDetail);
}
