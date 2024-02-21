import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PopupWindow from '@components/PopupWindow/Dialog';

import classes from '../style.module.scss';

const LiveEndedPopUp = () => {
  const [isShow, setIsShow] = useState(true);

  return (
    <PopupWindow open={isShow} onClose={() => setIsShow(false)}>
      <div className={classes.liveEndedPopupContainer}>
        <p className={classes.message}>
          <FormattedMessage id="item_detail_bid_live_closed" />
        </p>
        <button type="button" onClick={() => setIsShow(false)} className={classes.button}>
          <FormattedMessage id="close" />
        </button>
      </div>
    </PopupWindow>
  );
};

export default LiveEndedPopUp;
