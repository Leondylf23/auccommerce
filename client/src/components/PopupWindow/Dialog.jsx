import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Dialog } from '@mui/material';

import classes from './style.module.scss';

// eslint-disable-next-line arrow-body-style
const PopupWindow = ({ open, children, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.dialogWrapper }}>
      <div data-testid='popup-window'>
        {children}
      </div>
    </Dialog>
  );
};

PopupWindow.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.element,
  onClose: PropTypes.func,
};

export default PopupWindow;
