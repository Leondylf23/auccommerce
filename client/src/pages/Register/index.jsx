import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import { sendRegisterData, showPopup } from '@containers/App/actions';
import { encryptDataAES } from '@utils/allUtils';
import { selectLogin } from '@containers/Client/selectors';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';

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
  const [location, setLocation] = useState('');

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
    if (location.length < 3 || location.length > 255) {
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
      location: encryptDataAES(location),
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

  const defaultTheme = createTheme();

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin]);

  return (
    <div data-testid="register-page">
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
                <FormattedMessage id="register_title" />
              </Typography>
              <Box component="form" noValidate onSubmit={sendRegister} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label={<FormattedMessage id="register_fullname" />}
                  name="fullname"
                  autoFocus
                  onChange={(e) => setFullname(e.target.value)}
                  size="small"
                />
                <TextField
                  name="dob"
                  label="Date of Birth"
                  InputLabelProps={{ shrink: true, required: true }}
                  type="date"
                  onChange={(e) => setDob(e.target.value)}
                  value={dob}
                  size="small"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={<FormattedMessage id="register_email" />}
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
                  label={<FormattedMessage id="register_password" />}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="location"
                  label={<FormattedMessage id="register_location" />}
                  id="location"
                  onChange={(e) => setLocation(e.target.value)}
                  size="small"
                />
                <Autocomplete
                  margin="normal"
                  disablePortal
                  id="role"
                  options={optionRole}
                  size="small"
                  value={role}
                  onChange={(e, newValue) => setRole(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="role"
                      margin="normal"
                      size="small"
                      required
                      label={<FormattedMessage id="register_role" />}
                    />
                  )}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ my: 1, textTransform: 'none' }}
                  size="small"
                  data-testid="register-button-submit"
                >
                  <FormattedMessage id="register_title" />
                </Button>
                <div className={classes.register} data-testid="login-button">
                  <h5 onClick={() => navigate('/login')}>
                    <FormattedMessage id="register_login_footer" />
                  </h5>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

const optionRole = ['customer', 'business'];

Register.propTypes = {
  isLogin: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isLogin: selectLogin,
});

export default connect(mapStateToProps)(Register);
