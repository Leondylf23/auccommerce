import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createStructuredSelector } from 'reselect';
import { getUserDataDecrypt } from '@utils/allUtils';

import { setLocale } from '@containers/App/actions';
import { selectLogin, selectUserData } from '@containers/Client/selectors';
import DropDownMenu from './components/DropdownMenu';
import Logo from '../../static/images/auction.png';

import classes from './style.module.scss';

const Navbar = ({ locale, isUserLogined, userData, isUserLoginedTest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuPosition, setMenuPosition] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isBusiness, setIsBusiness] = useState(false);

  const open = Boolean(menuPosition);
  const isOpenMenu = Boolean(anchorEl);

  const openCloseProfileMenu = (e) => {
    if (isOpenMenu) {
      setAnchorEl(null);
    } else {
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClick = (event) => {
    setMenuPosition(event.currentTarget);
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const onSelectLang = (lang) => {
    if (lang !== locale) {
      dispatch(setLocale(lang));
    }
    handleClose();
  };

  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (userData) {
      const user = getUserDataDecrypt(userData);
      setProfileImg(user?.profileImage);
      setIsBusiness(user?.role === 'business');
    }
  }, [userData]);

  return (
    <div className={classes.headerWrapper} data-testid="navbar">
      <div className={classes.contentWrapper}>
        <div className={classes.logoImage} onClick={goHome}>
          <img className={classes.logo} src={Logo} alt="Logo" />
        </div>
        <div className={classes.toolbar}>
          {isUserLogined || isUserLoginedTest ? (
            <div className={classes.profile} data-testid="nav-profile-btn">
              <div onClick={openCloseProfileMenu}>
                <Avatar className={classes.avatar} src={profileImg} />
              </div>
              <DropDownMenu
                isOpen={isOpenMenu}
                isBusiness={isBusiness}
                anchorEl={anchorEl}
                onClose={openCloseProfileMenu}
                labeledMenu=""
              />
            </div>
          ) : (
            <div className={classes.userButtons}>
              <button type="button" className={classes.login} onClick={() => navigate('/login')}>
                <FormattedMessage id="nav_login" />
              </button>
              <button type="button" className={classes.register} onClick={() => navigate('/register')}>
                <FormattedMessage id="nav_register" />
              </button>
            </div>
          )}
          <div className={classes.toggle} onClick={handleClick}>
            <Avatar className={classes.avatar} src={locale === 'id' ? '/id.png' : '/en.png'} />
            <div className={classes.lang}>{locale}</div>
            <ExpandMoreIcon />
          </div>
        </div>
        <Menu open={open} anchorEl={menuPosition} onClose={handleClose}>
          <MenuItem onClick={() => onSelectLang('id')} selected={locale === 'id'}>
            <div className={classes.menu}>
              <Avatar className={classes.menuAvatar} src="/id.png" />
              <div className={classes.menuLang}>
                <FormattedMessage id="app_lang_id" />
              </div>
            </div>
          </MenuItem>
          <MenuItem onClick={() => onSelectLang('en')} selected={locale === 'en'}>
            <div className={classes.menu}>
              <Avatar className={classes.menuAvatar} src="/en.png" />
              <div className={classes.menuLang}>
                <FormattedMessage id="app_lang_en" />
              </div>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  locale: PropTypes.string.isRequired,
  isUserLogined: PropTypes.bool,
  userData: PropTypes.string,
  isUserLoginedTest: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isUserLogined: selectLogin,
  userData: selectUserData,
});

export default connect(mapStateToProps)(Navbar);
