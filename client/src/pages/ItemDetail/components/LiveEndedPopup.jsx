import { useState } from 'react';
import PopupWindow from '@components/PopupWindow/Dialog';

import classes from '../style.module.scss';

const LiveEndedPopUp = () => {
  const [isShow, setIsShow] = useState(true);

  return (
    <PopupWindow open={isShow} onClose={() => setIsShow(false)}>
      <div className={classes.liveEndedPopupContainer}>
        <p className={classes.message}>Live has ended.</p>
        <button type="button" onClick={() => setIsShow(false)} className={classes.button}>
          Close
        </button>
      </div>
    </PopupWindow>
  );
};

export default LiveEndedPopUp;
