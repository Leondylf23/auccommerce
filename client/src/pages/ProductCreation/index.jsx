import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { showPopup } from '@containers/App/actions';
import { createNewProduct, deleteProduct, getMyProductDetail, updateProduct } from './actions';

import { selectMyProductData } from './selectors';
import NoImage from '../../static/images/no_image.png';
import classes from './style.module.scss';

const ProductCreation = ({ productDetail }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [formData, setFormData] = useState({});
  const [imageData, setImageData] = useState(null);

  const setNewImage = (e) => {
    const imageFile = e.target.files[0];

    setImageData(imageFile);
  };

  const removeImage = () => {
    setImageData(null);
  };

  const saveBtn = () => {
    if (!(formData?.title?.length > 5 && formData?.title?.length <= 255)) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'product_creation_title' }),
          intl.formatMessage({ id: 'product_creation_title_validation' })
        )
      );
      return;
    }
    if (!(formData?.price?.length > 2 && formData?.price?.length <= 255)) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'product_creation_title' }),
          intl.formatMessage({ id: 'product_creation_price_validation' })
        )
      );
      return;
    }
    if (!(formData?.description?.length > 5 && formData?.description?.length <= 500)) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'product_creation_title' }),
          intl.formatMessage({ id: 'product_creation_description_validation' })
        )
      );
      return;
    }

    if (!(imageData || formData?.imageUrl)) {
      dispatch(
        showPopup(
          intl.formatMessage({ id: 'product_creation_title' }),
          intl.formatMessage({ id: 'product_creation_image_validation' })
        )
      );
      return;
    }

    const form = new FormData();
    if (id) form.append('id', id);
    form.append('title', formData?.title);
    form.append('price', formData?.price);
    form.append('description', formData?.description);

    if (imageData) form.append('imageData', imageData);

    if (id) {
      dispatch(
        updateProduct(form, () => {
          setImageData(null);
          dispatch(
            showPopup(
              intl.formatMessage({ id: 'product_creation_title' }),
              intl.formatMessage({ id: 'product_creation_save_success' })
            )
          );
        })
      );
    } else {
      dispatch(
        createNewProduct(form, () => {
          navigate(`/product-creation/${id}`);
          dispatch(
            showPopup(
              intl.formatMessage({ id: 'product_creation_title' }),
              intl.formatMessage({ id: 'product_creation_save_success' })
            )
          );
        })
      );
    }
  };

  const deleteBtn = () => {
    dispatch(
      deleteProduct({ id }, () => {
        navigate('/');
      })
    );
  };

  useEffect(() => {
    if (id) {
      dispatch(
        getMyProductDetail({ id }, () => {
          navigate('/');
        })
      );
    }
  }, []);
  useEffect(() => {
    if (productDetail && id) {
      const convertObj = {
        ...productDetail,
      };
      setFormData(convertObj);
    }
  }, [productDetail]);

  return (
    <div className={classes.mainContainer} data-testid="productCreation-page">
      <div className={classes.topContentContainer}>
        <div className={classes.leftContent}>
          <img
            className={classes.image}
            src={imageData ? URL.createObjectURL(imageData) : formData?.imageUrl ?? NoImage}
            alt="Img failed!"
          />
          <div className={classes.contentDetails}>
            {imageData ? (
              <button type="button" className={classes.deleteBtn} data-type="red" onClick={() => removeImage()}>
                <FormattedMessage id="product_creation_rmv_img_btn" data-testid="image-button" />
              </button>
            ) : id ? (
              <>
                <label htmlFor="imageInput" className={classes.fileInput}>
                  <FormattedMessage id="product_creation_chg_img_btn" />
                </label>
                <input hidden id="imageInput" type="file" accept="image/*" onChange={setNewImage} />
              </>
            ) : (
              <>
                <label htmlFor="imageInput" className={classes.fileInput}>
                  <FormattedMessage id="product_creation_add_img_btn" />
                </label>
                <input hidden id="imageInput" type="file" accept="image/*" onChange={setNewImage} />
              </>
            )}
          </div>
        </div>
        <div className={classes.rightContent}>
          <label className={classes.label} htmlFor="title">
            <FormattedMessage id="product_creation_title_label" />
          </label>
          <input
            className={classes.input}
            id="title"
            type="text"
            value={formData?.title}
            onChange={(e) => setFormData((prevVal) => ({ ...prevVal, title: e.target.value }))}
          />

          <label className={classes.label} htmlFor="price">
            <FormattedMessage id="product_creation_price_label" />
          </label>
          <input
            className={classes.input}
            id="price"
            type="text"
            value={formData?.price}
            onChange={(e) => setFormData((prevVal) => ({ ...prevVal, price: e.target.value }))}
          />
          <label className={classes.label} htmlFor="desc">
            <FormattedMessage id="product_creation_desc_label" />
          </label>
          <textarea
            className={classes.input}
            id="desc"
            type="text"
            data-type="area"
            value={formData?.description}
            onChange={(e) => setFormData((prevVal) => ({ ...prevVal, description: e.target.value }))}
          />
          <div className={classes.footerButtons}>
            <button type="button" className={classes.button} onClick={saveBtn}>
              <FormattedMessage id="product_creation_save_btn" data-testid="save-button" />
            </button>
            {id && (
              <button type="button" className={classes.button} data-type="red" onClick={deleteBtn}>
                <FormattedMessage id="product_creation_delete_btn" data-testid="delete-button" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCreation.propTypes = {
  productDetail: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  productDetail: selectMyProductData,
});

export default connect(mapStateToProps)(ProductCreation);
