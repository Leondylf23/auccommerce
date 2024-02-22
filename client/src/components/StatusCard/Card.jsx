import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import classes from './style.module.scss';

const StatusCard = ({ status = '' }) => {
  const intl = useIntl();
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    switch (status) {
      case 'WAITING':
        setStatusData({ label: intl.formatMessage({ id: 'status_waiting' }), color: 'yellow' });
        break;
      case 'SUCCESS':
        setStatusData({ label: intl.formatMessage({ id: 'status_success' }), color: 'green' });
        break;
      case 'FAILED':
        setStatusData({ label: intl.formatMessage({ id: 'status_failed' }), color: 'red' });
        break;
      default:
        setStatusData({ label: 'Unknown', color: '' });
        break;
    }
  }, [status, intl]);

  return (
    <div className={classes.statusCardContainer} data-type={statusData?.color}>
      <p className={classes.text}>{statusData?.label}</p>
    </div>
  );
};

StatusCard.propTypes = {
  status: PropTypes.string,
};

export default StatusCard;
