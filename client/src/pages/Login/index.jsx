import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

import { sendForgotPassword, sendLoginData, showPopup } from '@containers/App/actions';
import { decryptDataAES, encryptDataAES } from '@utils/allUtils';
import { selectLogin } from '@containers/Client/selectors';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import classes from './style.module.scss';

const Login = ({ isLogin }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassPage, setIsForgotPassPage] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
  };
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

  const defaultTheme = createTheme();

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin, navigate]);

  return (
    <div data-testid="login-page">
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            {isForgotPassPage ? (
              <div data-testid="forgot-pass-page">
                <Box
                  sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography component="h1" variant="h5">
                    <FormattedMessage id="login_title_forgot" />
                  </Typography>
                  <Box component="form" noValidate onSubmit={sendForgotPasswordData} sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label={<FormattedMessage id="login_email" />}
                      name="email"
                      autoComplete="email"
                      autoFocus
                      onChange={(e) => setEmail(e.target.value)}
                      size="small"
                    />
                    {newPass !== '' && (
                      <div className={classes.newPassContainer}>
                        <p className={classes.title}>
                          <FormattedMessage id="login_forgot_pass_new_pass" />
                        </p>
                        <div className={classes.newPass}>
                          <h5 className={classes.content}>{newPass}</h5>
                          <CopyToClipboard text={newPass} onCopy={onCopyText} data-testid="forgot-password-copy">
                            <ContentPasteIcon sx={{ opacity: 0.5, cursor: 'pointer', width: '15px', height: '15px' }} />
                          </CopyToClipboard>
                        </div>

                        {copyStatus && <p className={classes.copyText}>Text copied to clipboard!</p>}
                      </div>
                    )}
                    {newPass === '' && (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ my: 1, textTransform: 'none' }}
                        size="small"
                        data-testid="forgot-password-submit"
                      >
                        <FormattedMessage id="login_button_forgot" />
                      </Button>
                    )}
                    <h5
                      className={classes.forgotPassFooter}
                      onClick={() => setIsForgotPassPage(false)}
                      data-testid="forgot-password-back"
                    >
                      <FormattedMessage id="login_forgot_pass_back" />
                    </h5>
                  </Box>
                </Box>
              </div>
            ) : (
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography component="h1" variant="h5">
                  <FormattedMessage id="login_title" />
                </Typography>
                <Box component="form" noValidate onSubmit={sendLogin} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={<FormattedMessage id="login_email" />}
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={<FormattedMessage id="login_password" />}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                  />
                  <div className={classes.forgotPass}>
                    <h5 onClick={() => setIsForgotPassPage(true)} data-testid="forgot-pass-button">
                      <FormattedMessage id="login_forgot_pass" />
                    </h5>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ my: 1, textTransform: 'none' }}
                    size="small"
                    data-testid="login-button-submit"
                  >
                    <FormattedMessage id="login_title" />
                  </Button>
                  <div className={classes.register} data-testid="register-button">
                    <h5 onClick={() => navigate('/register')}>
                      <FormattedMessage id="login_register_footer" />
                    </h5>
                  </div>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </ThemeProvider>
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
