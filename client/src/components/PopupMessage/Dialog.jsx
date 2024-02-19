import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Dialog } from '@mui/material';

import classes from './style.module.scss';

const PopupMessage = ({ open, title, message, onClose }) => (
  <div data-testid="popup-message">
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.dialogWrapper }}>
      <div className={classes.title} data-testid="popup-message-title">
        <FormattedMessage id={title || 'app_popup_error_title'} />
      </div>
      <div className={classes.message} data-testid="popup-message-msg">
        <FormattedMessage id={message || 'app_popup_error_message'} />
      </div>
      <button type="button" onClick={onClose} className={classes.button} data-testid="popup-message-btn">
        <FormattedMessage id="app_popup_close_button_label" />
      </button>
    </Dialog>
  </div>
);

PopupMessage.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

export default PopupMessage;
