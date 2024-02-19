import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';

import { showPopup } from '@containers/App/actions';
import { selectUserData } from '@containers/Client/selectors';
import { decryptDataAES, encryptDataAES } from '@utils/allUtils';
import { setUserData } from '@containers/Client/actions';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { Link } from 'react-router-dom';

import { selectProfileData } from './selectors';
import { getProfileData, saveProfileData } from './actions';

import classes from './style.module.scss';

const ProfilePage = ({ profileData, userDataSelect }) => {
  const dispatch = useDispatch();

  const intl = useIntl();

  const [userData, setUserDataInternal] = useState();
  const [profileImg, setProfileImg] = useState(null);

  const setNewProfileImage = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
  };

  const saveGeneralData = () => {
    if (userData?.fullname.length < 3 || userData?.length > 255) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'profile_title' }),
          intl.formatMessage({ id: 'register_fullname_validation' })
        )
      );
      return;
    }
    if (userData?.dob === '') {
      dispatch(
        showPopup(intl.formatMessage({ id: 'profile_title' }), intl.formatMessage({ id: 'register_dob_validation' }))
      );
      return;
    }
    if (new Date().getTime - new Date(userData?.dob).getTime() < 15 * 365 * 24 * 3600000) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'profile_title' }),
          intl.formatMessage({ id: 'register_dob_age_validation' })
        )
      );
      return;
    }

    const form = new FormData();

    form.append('fullname', userData?.fullname);
    form.append('dob', userData?.dob);
    if (userData) {
      try {
        const user = JSON.parse(decryptDataAES(userData));
        if (user.role === 'business') {
          form.append('location', userData?.location);
        }
      } catch (error) {
        console.log('error parsing user data');
      }
    }

    if (profileImg) form.append('imageData', profileImg);

    dispatch(
      saveProfileData(form, (imageUrl) => {
        if (imageUrl) {
          const user = JSON.parse(decryptDataAES(userDataSelect));
          user.profileImage = imageUrl;

          const updatedUser = encryptDataAES(JSON.stringify(user));
          dispatch(setUserData(updatedUser));
        }

        setProfileImg(null);
        dispatch(
          showPopup(
            intl.formatMessage({ id: 'profile_title' }),
            intl.formatMessage({ id: 'profile_generic_save_success' })
          )
        );
        dispatch(getProfileData());
      })
    );
  };

  useEffect(() => {
    dispatch(getProfileData());
  }, []);
  useEffect(() => {
    setUserDataInternal(profileData);
  }, [profileData]);

  return (
    <div data-testid="profile-container" className={classes.mainContainer}>
      <h1 className={classes.title}>
        <FormattedMessage id="profile_title" />
      </h1>
      <div className={classes.contentContainer}>
        <div className={classes.leftSide}>
          <Avatar
            className={classes.profileImage}
            src={profileImg ? URL.createObjectURL(profileImg) : profileData?.profileImage}
            alt="Load image failed!"
          />
          {profileImg ? (
            <button
              data-testid="profile-button-image"
              type="button"
              className={classes.button}
              data-type="red"
              onClick={() => setProfileImg(null)}
            >
              <FormattedMessage id="profile_delete_img" />
            </button>
          ) : (
            <>
              <label htmlFor="profileImageFile" className={classes.button}>
                <FormattedMessage id="profile_chg_img" />
              </label>
              <input type="file" accept="image/*" hidden id="profileImageFile" onChange={setNewProfileImage} />
            </>
          )}
          <div className={classes.accountInfoContainer}>
            <p>
              {profileData?.role === 'customer'
                ? intl.formatMessage({ id: 'profile_customer' })
                : intl.formatMessage({ id: 'profile_business' })}
            </p>
            <p>{profileData?.createdAt}</p>
          </div>
        </div>
        <div className={classes.rigthSide}>
          <h3 className={classes.containerTitle}>
            <FormattedMessage id="profile_general" />
          </h3>
          <label htmlFor="email" className={classes.label}>
            <FormattedMessage id="profile_email" />
          </label>
          <input type="email" id="email" disabled className={classes.input} value={userData?.email} />
          <label htmlFor="fullname" className={classes.label}>
            <FormattedMessage id="profile_fullname" />
          </label>
          <input
            type="text"
            id="fullname"
            className={classes.input}
            value={userData?.fullname}
            onChange={(e) => setUserDataInternal((prevVal) => ({ ...prevVal, fullname: e.target.value }))}
          />
          <label htmlFor="dob" className={classes.label}>
            <FormattedMessage id="profile_dob" />
          </label>
          <input
            type="date"
            id="dob"
            className={classes.input}
            value={userData?.dob}
            onChange={(e) => setUserDataInternal((prevVal) => ({ ...prevVal, dob: e.target.value }))}
          />
          {userData?.role === 'business' && (
            <>
              <label htmlFor="dob" className={classes.label}>
                <FormattedMessage id="profile_location" />
              </label>
              <input
                type="text"
                id="location"
                className={classes.input}
                value={userData?.location}
                onChange={(e) => setUserDataInternal((prevVal) => ({ ...prevVal, location: e.target.value }))}
              />
            </>
          )}
          <label htmlFor="dob" className={classes.label}>
            <FormattedMessage id="profile_passwords" />
          </label>
          <div className={classes.password}>
            <input
              type="password"
              id="dob"
              className={classes.input}
              value="*******"
              onChange={(e) => setUserDataInternal((prevVal) => ({ ...prevVal, dob: e.target.value }))}
              disabled
            />
            <Link to="change-password">
              <ModeEditOutlineIcon />
            </Link>
          </div>
          <div className={classes.buttonConatainer}>
            <button
              data-testid="profile-button-submit"
              type="button"
              className={classes.button}
              onClick={saveGeneralData}
            >
              <FormattedMessage id="profile_save" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  profileData: PropTypes.object,
  userDataSelect: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  profileData: selectProfileData,
  userDataSelect: selectUserData,
});

export default connect(mapStateToProps)(ProfilePage);
