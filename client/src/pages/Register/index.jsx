import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import { sendRegisterData, showPopup } from '@containers/App/actions';
import { encryptDataAES } from '@utils/allUtils';
import { selectLogin } from '@containers/Client/selectors';
import Logo from '../../static/images/auction.png';

import classes from './style.module.scss';

const Register = ({ isLogin }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('');

  const sendRegister = (e) => {
    e.preventDefault();

    if (fullname.length < 3 || fullname.length > 255) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'register_title' }),
          intl.formatMessage({ id: 'register_fullname_validation' })
        )
      );
      return;
    }
    if (dob === '') {
      dispatch(
        showPopup(intl.formatMessage({ id: 'register_title' }), intl.formatMessage({ id: 'register_dob_validation' }))
      );
      return;
    }
    if (new Date().getTime - new Date(dob).getTime() < 15 * 365 * 24 * 3600000) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'register_title' }),
          intl.formatMessage({ id: 'register_dob_age_validation' })
        )
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dispatch(
        showPopup(intl.formatMessage({ id: 'register_title' }), intl.formatMessage({ id: 'register_email_validation' }))
      );
      return;
    }
    if (password.length < 6 || password.length > 20) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'register_title' }),
          intl.formatMessage({ id: 'register_password_validation' })
        )
      );
      return;
    }
    if (role === '') {
      dispatch(
        showPopup(intl.formatMessage({ id: 'register_title' }), intl.formatMessage({ id: 'register_role_valiation' }))
      );
      return;
    }

    const formData = {
      fullname: encryptDataAES(fullname),
      email: encryptDataAES(email),
      password: encryptDataAES(password),
      dob: encryptDataAES(dob),
      role: encryptDataAES(role),
    };

    dispatch(
      sendRegisterData(
        formData,
        () => {
          navigate('/login');
        },
        (err) => {
          if (err?.response?.status === 422) {
            dispatch(
              showPopup(
                intl.formatMessage({ id: 'register_title' }),
                intl.formatMessage({ id: 'register_email_has_taken' })
              )
            );
          } else {
            dispatch(showPopup());
          }
        }
      )
    );
  };

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin]);

  return (
    <div className={classes.fullContainer} data-testid="register-page">
      <div className={classes.innerContainer}>
        <div className={classes.logoContainer}>
          <div onClick={() => navigate('/')}>
            <img className={classes.logo} src={Logo} alt="Logo" />
          </div>
        </div>
        <h1 className={classes.title}>
          <FormattedMessage id="register_title" />
        </h1>
        <form className={classes.formContainer} onSubmit={sendRegister}>
          <label htmlFor="fullname" className={classes.label}>
            <FormattedMessage id="register_fullname" />
          </label>
          <input
            type="text"
            id="fullname"
            className={classes.input}
            placeholder={intl.formatMessage({ id: 'register_fullname_placeholder' })}
            onChange={(e) => setFullname(e.target.value)}
          />
          <label htmlFor="dob" className={classes.label}>
            <FormattedMessage id="register_dob" />
          </label>
          <input type="date" id="dob" className={classes.input} onChange={(e) => setDob(e.target.value)} />
          <label htmlFor="email" className={classes.label}>
            <FormattedMessage id="register_email" />
          </label>
          <input
            type="email"
            id="email"
            className={classes.input}
            placeholder={intl.formatMessage({ id: 'register_email_placeholder' })}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className={classes.label}>
            <FormattedMessage id="register_password" />
          </label>
          <input
            type="password"
            id="password"
            className={classes.input}
            placeholder={intl.formatMessage({ id: 'register_password_placeholder' })}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="role" className={classes.label}>
            <FormattedMessage id="register_role" />
          </label>
          <select name="role" id="role" className={classes.input} onChange={(e) => setRole(e.target.value)}>
            <option value="">
              <FormattedMessage id="register_role_placeholder" />
            </option>
            <option value="customer">
              <FormattedMessage id="register_role_customer" />
            </option>
            <option value="business">
              <FormattedMessage id="register_role_business" />
            </option>
          </select>
          <button type="submit" className={classes.button}>
            <FormattedMessage id="register_button" />
          </button>
          <div className={classes.footer}>
            <h3 className={classes.footerInner}>
              <FormattedMessage id="register_login_footer" />
              <div className={classes.textContainer} onClick={() => navigate('/login')}>
                <p className={classes.footerLink}>
                  <FormattedMessage id="register_login_footer_link" />
                </p>
              </div>
              .
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  isLogin: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isLogin: selectLogin,
});

export default connect(mapStateToProps)(Register);
