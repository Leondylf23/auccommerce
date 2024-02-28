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
      case 'ACTIVED':
        setStatusData({ label: intl.formatMessage({ id: 'status_actived' }), color: 'green' });
        break;
      case 'DEACTIVATED':
        setStatusData({ label: intl.formatMessage({ id: 'status_deactived' }), color: 'red' });
        break;
      case 'LIVE':
        setStatusData({ label: intl.formatMessage({ id: 'status_live' }), color: 'yellow' });
        break;
      case 'PLACED':
        setStatusData({ label: intl.formatMessage({ id: 'status_placed' }), color: 'sky' });
        break;
      case 'WAIT_PAYMENT':
        setStatusData({ label: intl.formatMessage({ id: 'status_wait_pay' }), color: 'yellow' });
        break;
      case 'WAIT_CONFIRM':
        setStatusData({ label: intl.formatMessage({ id: 'status_confirm' }), color: 'yellow' });
        break;
      case 'PROCESSING':
        setStatusData({ label: intl.formatMessage({ id: 'status_processing' }), color: 'blue' });
        break;
      case 'SHIPPING':
        setStatusData({ label: intl.formatMessage({ id: 'status_shipping' }), color: 'blue' });
        break;
      case 'COMPLETED':
        setStatusData({ label: intl.formatMessage({ id: 'status_completed' }), color: 'green' });
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
