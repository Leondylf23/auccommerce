import PropTypes from 'prop-types';

const BlankLayout = ({ children }) => <div>{children}</div>;

BlankLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlankLayout;
