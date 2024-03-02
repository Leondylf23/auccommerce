import { FormattedMessage } from 'react-intl';

import classes from '../style.module.scss';

const EmptyContainer = () => (
  <div className={classes.emptyContainer}>
    <h2 className={classes.text}>
      <FormattedMessage id="empty_data" />
    </h2>
  </div>
);

export default EmptyContainer;
