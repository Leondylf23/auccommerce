import { showPopup } from '@containers/App/actions';
import { saveNewPassword } from '@pages/Profile/actions';
import { encryptDataAES } from '@utils/allUtils';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import classes from './style.module.scss';

const ChangePassword = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [userPassword, setUserPassword] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  const saveNewPasswordData = () => {
    if (userPassword?.oldPass === '' || userPassword?.newPass === '' || userPassword?.confirmPass === '') {
      dispatch(
        showPopup(intl.formatMessage({ id: 'profile_title' }), intl.formatMessage({ id: 'profile_password_fill_all' }))
      );
      return;
    }
    if (userPassword?.newPass?.length < 6 || userPassword?.newPass?.length > 20) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'profile_title' }),
          intl.formatMessage({ id: 'register_password_validation' })
        )
      );
      return;
    }
    if (userPassword?.newPass !== userPassword?.confirmPass) {
      dispatch(
        showPopup(intl.formatMessage({ id: 'profile_title' }), intl.formatMessage({ id: 'profile_password_same_pass' }))
      );
      return;
    }

    const encryptedData = {
      oldPassword: encryptDataAES(userPassword?.oldPass),
      newPassword: encryptDataAES(userPassword?.newPass),
    };

    dispatch(
      saveNewPassword(
        encryptedData,
        () => {
          setUserPassword({ oldPass: '', newPass: '', confirmPass: '' });
          dispatch(
            showPopup(
              intl.formatMessage({ id: 'profile_title' }),
              intl.formatMessage({ id: 'profile_password_success' })
            )
          );
        },
        () => {
          dispatch(
            showPopup(
              intl.formatMessage({ id: 'profile_title' }),
              intl.formatMessage({ id: 'profile_password_old_pass_not_match' })
            )
          );
        }
      )
    );
  };
  return (
    <div data-testid="changePassword-container">
      <div className={classes.containerTitle}>
        <Link to={-1}>
          <ArrowBackIcon />
        </Link>
        <h3>
          <FormattedMessage id="profile_passwords" />
        </h3>
      </div>
      <label htmlFor="oldPassword" className={classes.label}>
        <FormattedMessage id="profile_password_old" />
      </label>
      <input
        type="password"
        id="oldPassword"
        className={classes.input}
        value={userPassword?.oldPass}
        onChange={(e) => setUserPassword((prevVal) => ({ ...prevVal, oldPass: e.target.value }))}
      />
      <label htmlFor="newPassword" className={classes.label}>
        <FormattedMessage id="profile_password_new" />
      </label>
      <input
        type="password"
        id="newPassword"
        className={classes.input}
        value={userPassword?.newPass}
        onChange={(e) => setUserPassword((prevVal) => ({ ...prevVal, newPass: e.target.value }))}
      />
      <label htmlFor="confirmNewPass" className={classes.label}>
        <FormattedMessage id="profile_password_confirm" />
      </label>
      <input
        type="password"
        id="confirmNewPass"
        className={classes.input}
        value={userPassword?.confirmPass}
        onChange={(e) => setUserPassword((prevVal) => ({ ...prevVal, confirmPass: e.target.value }))}
      />
      <div className={classes.buttonConatainer}>
        <button type="button" className={classes.button} onClick={saveNewPasswordData} data-testid="changePassword-btn">
          <FormattedMessage id="profile_save" />
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
