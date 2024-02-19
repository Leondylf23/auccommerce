import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectLogin, selectUserData } from '@containers/Client/selectors';
import { decryptDataAES } from '@utils/allUtils';

const Client = ({ login, children, role, userData }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!login) {
      navigate('/login');
    }
    if (login && role && role !== '*') {
      const user = JSON.parse(decryptDataAES(userData));

      if (!(user?.role === role)) {
        navigate('/');
      }
    }
  }, [login, navigate, role, userData]);

  return children;
};

Client.propTypes = {
  login: PropTypes.bool,
  children: PropTypes.element,
  role: PropTypes.string,
  userData: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  userData: selectUserData,
});

export default connect(mapStateToProps)(Client);
