import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { sendForgotPassword, sendLoginData, showPopup } from '@containers/App/actions';
import { decryptDataAES, encryptDataAES } from '@utils/allUtils';
import { selectLogin } from '@containers/Client/selectors';
import Logo from '../../static/images/auction.png';

import classes from './style.module.scss';

const Login = ({ isLogin }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassPage, setIsForgotPassPage] = useState(false);
  const [newPass, setNewPass] = useState('');

  const sendLogin = (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      dispatch(showPopup(intl.formatMessage({ id: 'login_title' }), intl.formatMessage({ id: 'login_validation' })));
      return;
    }

    const formData = {
      email: encryptDataAES(email),
      password: encryptDataAES(password),
    };

    dispatch(
      sendLoginData(
        formData,
        () => {
          navigate('/');
        },
        (err) => {
          if (err?.response?.status === 401) {
            dispatch(
              showPopup(
                intl.formatMessage({ id: 'login_title' }),
                intl.formatMessage({ id: 'login_wrong_credentials' })
              )
            );
          } else {
            dispatch(showPopup());
          }
        }
      )
    );
  };

  const sendForgotPasswordData = (e) => {
    e.preventDefault();

    if (newPass !== '') return;

    if (email === '') {
      dispatch(showPopup(intl.formatMessage({ id: 'login_title' }), intl.formatMessage({ id: 'login_validation' })));
      return;
    }

    dispatch(
      sendForgotPassword(
        { email },
        (newPassword) => {
          setNewPass(decryptDataAES(newPassword));
        },
        () => {
          dispatch(
            showPopup(
              intl.formatMessage({ id: 'login_title' }),
              intl.formatMessage({ id: 'login_forgot_pass_email_not_found' })
            )
          );
        }
      )
    );
  };

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin]);

  return (
    <div className={classes.fullContainer} data-testid="login-page">
      {isForgotPassPage ? (
        <div className={classes.innerContainer}>
          <div className={classes.logoContainer}>
            <div onClick={() => navigate('/')}>
              <img className={classes.logo} src={Logo} alt="Logo" />
            </div>
          </div>
          <h1 className={classes.title}>
            <FormattedMessage id="login_title_forgot" />
          </h1>
          <form className={classes.formContainer} onSubmit={sendForgotPasswordData}>
            <label htmlFor="email" className={classes.label}>
              <FormattedMessage id="login_email" />
            </label>
            <input
              type="email"
              id="email"
              className={classes.input}
              placeholder={intl.formatMessage({ id: 'login_email_placeholder' })}
              onChange={(e) => setEmail(e.target.value)}
            />
            {newPass !== '' && (
              <div className={classes.newPassContainer}>
                <h2 className={classes.title}>
                  <FormattedMessage id="login_forgot_pass_new_pass" />
                </h2>
                <h3 className={classes.content}>{newPass}</h3>
              </div>
            )}
            {newPass === '' && (
              <button type="submit" className={classes.button}>
                <FormattedMessage id="login_button_forgot" />
              </button>
            )}
            <div onClick={() => setIsForgotPassPage(false)}>
              <p className={classes.forgotPassFooter}>
                <FormattedMessage id="login_forgot_pass_back" />
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className={classes.innerContainer}>
          <div className={classes.logoContainer}>
            <div onClick={() => navigate('/')}>
              <img className={classes.logo} src={Logo} alt="Logo" />
            </div>
          </div>
          <h1 className={classes.title}>
            <FormattedMessage id="login_title" />
          </h1>
          <form className={classes.formContainer} onSubmit={sendLogin}>
            <label htmlFor="email" className={classes.label}>
              <FormattedMessage id="login_email" />
            </label>
            <input
              type="email"
              id="email"
              className={classes.input}
              placeholder={intl.formatMessage({ id: 'login_email_placeholder' })}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className={classes.label}>
              <FormattedMessage id="login_password" />
            </label>
            <input
              type="password"
              id="password"
              className={classes.input}
              placeholder={intl.formatMessage({ id: 'login_password_placeholder' })}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={classes.forgotPasswordContainer}>
              <div onClick={() => setIsForgotPassPage(true)}>
                <p className={classes.text}>
                  <FormattedMessage id="login_forgot_pass" />
                </p>
              </div>
            </div>
            <button type="submit" className={classes.button}>
              <FormattedMessage id="login_button" />
            </button>
            <div className={classes.footer}>
              <h3 className={classes.footerInner}>
                <FormattedMessage id="login_register_footer" />
                <div className={classes.textContainer} onClick={() => navigate('/register')}>
                  <p className={classes.footerLink}>
                    <FormattedMessage id="login_register_footer_link" />
                  </p>
                </div>
                .
              </h3>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

Login.propTypes = {
  isLogin: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isLogin: selectLogin,
});

export default connect(mapStateToProps)(Login);
