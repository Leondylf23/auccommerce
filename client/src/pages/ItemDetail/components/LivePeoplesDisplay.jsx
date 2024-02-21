import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';

import classes from '../style.module.scss';

const LivePeoplesDisplay = ({ peoples }) => (
  <div className={classes.livePeopleDispContainer}>
    <p className={classes.title}>Live Now</p>
    <div className={classes.avatarsContainer}>
      {peoples[0] && <Avatar className={classes.avatar} src={peoples[0]?.image} alt={peoples[0]?.image} />}
      {peoples[0] && <Avatar className={classes.avatar} src={peoples[1]?.image} alt={peoples[1]?.image} />}
      {peoples?.length > 3 && (
        <div className={classes.avatar} data-type="nonAvatar">
          <p>+{peoples?.length - 2}</p>
        </div>
      )}
    </div>
  </div>
);

LivePeoplesDisplay.propTypes = {
  peoples: PropTypes.array,
};

export default LivePeoplesDisplay;
