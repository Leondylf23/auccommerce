import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropType from 'prop-types';
import Typography from '@mui/material/Typography';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import BallotIcon from '@mui/icons-material/Ballot';
import InventoryIcon from '@mui/icons-material/Inventory';

import { setLogin, setToken, setUserData } from '@containers/Client/actions';

import classes from './style.module.scss';

// eslint-disable-next-line react/prop-types
const DropDownMenu = ({ isOpen, anchorEl, onClose, labeledMenu, isBusiness }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function menuItemAction(id) {
    switch (id) {
      case 0:
        navigate('/profile');
        onClose();
        break;
      case 1:
        navigate('/my-bids');
        onClose();
        break;
      case 2:
        navigate('/my-auction');
        onClose();
        break;
      case 3:
        // navigate("/newjourney");
        dispatch(setLogin(false));
        dispatch(setUserData(null));
        dispatch(setToken(null));
        onClose();
        navigate('/login');
        break;
    }
  }

  return (
    <div data-testid="nav-dropdown">
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': labeledMenu,
        }}
      >
        <MenuItem onClick={() => menuItemAction(0)}>
          <Person2OutlinedIcon className={classes.icon} data-type="profile" />
          <Typography variant="body2">
            <FormattedMessage id="nav_profile" />
          </Typography>
        </MenuItem>
        {!isBusiness ? (
          <MenuItem onClick={() => menuItemAction(1)}>
            <BallotIcon className={classes.icon} data-type="mybids" />
            <Typography variant="body2">
              <FormattedMessage id="nav_mybids" />
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => menuItemAction(2)}>
            <InventoryIcon className={classes.icon} data-type="myauctions" />
            <Typography variant="body2">
              <FormattedMessage id="nav_myauction" />
            </Typography>
          </MenuItem>
        )}
        <div className={classes.divider} />
        <MenuItem onClick={() => menuItemAction(3)}>
          <LogoutIcon className={classes.icon} data-type="logout" />
          <Typography variant="body2">
            <FormattedMessage id="nav_logout" />
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

DropDownMenu.propType = {
  isOpen: PropType.bool.isRequired,
  onClose: PropType.func.isRequired,
  labeledMenu: PropType.string.isRequired,
  anchorEl: PropType.element.isRequired,
};

export default DropDownMenu;
