import PropTypes from 'prop-types';

import classes from '../style.module.scss';

const CategoryCard = ({ data, setSelectCategory }) => (
  <div className={classes.categoryContainer} onClick={() => setSelectCategory(data?.id)}>
    <img className={classes.image} src={data?.pictureUrl} alt="Url Broken" />
    <div className={classes.backdrop}>
      <p className={classes.text}>{data?.name}</p>
    </div>
  </div>
);

CategoryCard.propTypes = {
  data: PropTypes.object.isRequired,
  setSelectCategory: PropTypes.func.isRequired,
};

export default CategoryCard;
