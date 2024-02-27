import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import classes from '../style.module.scss';

const CategoryCard = ({ data, setSelectCategory }) => {
  const intl = useIntl();

  return (
    <div className={classes.categoryContainer} onClick={() => setSelectCategory(data?.id)}>
      <img className={classes.image} src={data?.pictureUrl} alt="Url Broken" />
      <div className={classes.backdrop}>
        <p className={classes.text}>{intl.formatMessage({ id: 'lang' }) === 'id' ? data?.nameId : data?.name}</p>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  data: PropTypes.object.isRequired,
  setSelectCategory: PropTypes.func.isRequired,
};

export default CategoryCard;
