import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import { FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';

const LivePeoplesDisplay = ({ peoples = [], isShowTitle = false }) => (
  <div className={classes.livePeopleDispContainer}>
    {isShowTitle && (
      <p className={classes.title}>
        <FormattedMessage id="item_detail_live_now" />
      </p>
    )}
    <div className={classes.avatarsContainer}>
      {peoples[0] && <Avatar className={classes.avatar} src={peoples[0]?.image} alt={peoples[0]?.image} />}
      {peoples[0] && <Avatar className={classes.avatar} src={peoples[1]?.image} alt={peoples[1]?.image} />}
      {peoples[0] && <Avatar className={classes.avatar} src={peoples[2]?.image} alt={peoples[2]?.image} />}
      {peoples[0] && <Avatar className={classes.avatar} src={peoples[3]?.image} alt={peoples[3]?.image} />}
      {peoples?.length > 4 && (
        <div className={classes.avatar} data-type="nonAvatar">
          <p>+{peoples?.length - 4}</p>
        </div>
      )}
    </div>
  </div>
);

LivePeoplesDisplay.propTypes = {
  peoples: PropTypes.array,
  isShowTitle: PropTypes.bool,
};

export default LivePeoplesDisplay;
