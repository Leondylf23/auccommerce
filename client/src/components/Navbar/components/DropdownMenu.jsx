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

import { setLogin, setToken, setUserData } from '@containers/Client/actions';

import classes from './style.module.scss';

// eslint-disable-next-line react/prop-types
const DropDownMenu = ({ isOpen, anchorEl, onClose, labeledMenu }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function menuItemAction(id) {
    switch (id) {
      case 0:
        navigate('/profile');
        onClose();
        break;
      case 1:
        navigate('/orderings');
        onClose();
        break;
      case 2:
        navigate('/coupons');
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
          <Person2OutlinedIcon className={classes.iconProfile} />
          <Typography variant="body2">
            <FormattedMessage id="nav_profile" />
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => menuItemAction(1)}>
          <BallotIcon className={classes.iconOrderings} />
          <Typography variant="body2">
            <FormattedMessage id="nav_orderings" />
          </Typography>
        </MenuItem>
        <div className={classes.divider} />
        <MenuItem onClick={() => menuItemAction(3)}>
          <LogoutIcon className={classes.iconLogout} />
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
