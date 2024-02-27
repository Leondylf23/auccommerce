import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import PopupWindow from '@components/PopupWindow/Dialog';

import classes from './style.module.scss';

const PopupConfirmation = ({ isOpen, onConfirmation, message, data }) => (
  <PopupWindow onClose={() => onConfirmation(false)} open={isOpen}>
    <div className={classes.confirmationPopupContainer}>
      <p className={classes.message}>
        {message}
        <p className={classes.data}>{data}</p>?
      </p>
      <div className={classes.buttons}>
        <button type="button" className={classes.button} onClick={() => onConfirmation(true)} data-type="red">
          <FormattedMessage id="yes" />
        </button>
        <button type="button" className={classes.button} onClick={() => onConfirmation(false)}>
          <FormattedMessage id="no" />
        </button>
      </div>
    </div>
  </PopupWindow>
);

PopupConfirmation.propTypes = {
  onConfirmation: PropTypes.func,
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  data: PropTypes.string,
};

export default PopupConfirmation;
