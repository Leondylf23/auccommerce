import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useIntl, FormattedMessage } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { produce } from 'immer';
import uuid from 'react-uuid';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { showPopup } from '@containers/App/actions';
import { selectCategory } from '@pages/Home/selectors';
import { getCategory } from '@pages/Home/actions';
import PopupConfirmation from '@components/PopupConfirmation/Dialog';
import { selectAuctionDetailData } from './selectors';
import { deleteAuctionData, getAuctionDetailData, saveAuctionData } from './actions';

import classes from './style.module.scss';
import { encryptDataAES } from '@utils/allUtils';

const itemGeneralDataDefault = {
  itemName: '',
  categoryId: -1,
  startBid: 0,
  startBidDate: '',
  deadlineBid: '',
  description: '',
};
const itemSpecificationDefault = {
  length: 1,
  width: 1,
  height: 1,
  weight: 1,
};

const AuctionForm = ({ detailData, categories }) => {
  const { id } = useParams();
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [itemGeneralData, setItemGeneralData] = useState(itemGeneralDataDefault);
  const [itemSpecificationData, setItemSpecificationData] = useState(itemSpecificationDefault);
  const [itemImages, setItemImages] = useState([]);
  const [isShowFileForm, setIsShowFileForm] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [errImgMsg, setErrImgMsg] = useState([]);
  const [errTimoutId, setErrTimeoutId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeletable, setIsDeletable] = useState(true);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isShowDeletePopup, setIsShowDeletePopup] = useState(false);

  const addImageData = (e) => {
    const { files } = e.target;
    const addedFiles = [];
    let isAnyTypeErr = false;
    let isAnyLenDataErr = false;
    let isAnySizeErr = false;

    setIsShowFileForm(false);

    if (files.length > 8 - itemImages.length) {
      isAnyLenDataErr = true;
    }

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      if (
        file.type.split('/')[0] !== 'image' ||
        !(file.type.split('/')[1] === 'jpg' || file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png')
      ) {
        isAnyTypeErr = true;
        // eslint-disable-next-line no-continue
        continue;
      }
      if (file.size > 5000000) {
        isAnySizeErr = true;
        // eslint-disable-next-line no-continue
        continue;
      }

      addedFiles.push({
        url: '',
        imageData: file,
        id: uuid(),
      });
    }

    if (isAnyTypeErr || isAnyLenDataErr || isAnySizeErr) {
      const msges = [];
      if (isAnyTypeErr) msges.push(<FormattedMessage id="auction_form_img_typ_err" />);
      if (isAnyLenDataErr) msges.push(<FormattedMessage id="auction_form_img_limit_err" />);
      if (isAnySizeErr) msges.push(<FormattedMessage id="auction_form_img_size_err" />);

      setErrImgMsg(msges);

      if (errTimoutId) clearTimeout(errTimoutId);
      setErrTimeoutId(
        setTimeout(() => {
          setErrImgMsg([]);
          setErrTimeoutId(null);
        }, 5000)
      );
    }
    if (addedFiles.length > 0) {
      setItemImages((prevVal) => [...prevVal, ...addedFiles]);
      setPreviewImage(addedFiles[0]);
    }
    setIsShowFileForm(true);
  };

  const onChangeInputItmSpec = (dataLabel, data) => {
    if ((dataLabel === 'weight', dataLabel === 'height', dataLabel === 'width', dataLabel === 'length') && data < 0)
      return;
    setItemSpecificationData(
      produce((draft) => {
        draft[dataLabel] = data;
      })
    );
  };

  const deleteImage = (selectedIndex) => {
    const deletedId = itemImages[selectedIndex]?.id;
    setItemImages(produce((draft) => draft.filter((_, index) => index !== selectedIndex)));
    if (deletedId === previewImage?.id) setPreviewImage(null);
  };

  const saveDataToDb = () => {
    const pageTitle = id
      ? intl.formatMessage({ id: 'auction_form_title_edit' })
      : intl.formatMessage({ id: 'auction_form_title_new' });
    if (
      itemGeneralData?.itemName === '' ||
      itemGeneralData?.startBid === 0 ||
      itemGeneralData?.deadlineBid === '' ||
      itemGeneralData?.description === '' ||
      itemGeneralData?.startBidDate === ''
    ) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_empty_err' })));
      return;
    }
    if (itemGeneralData?.itemName?.length < 5) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_itm_nm_err' })));
      return;
    }
    if (itemGeneralData?.startBid < 5000 || itemGeneralData?.startBid > 15000000) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_start_bid_err' })));
      return;
    }
    if (new Date(itemGeneralData?.startBidDate).getTime() < new Date().getTime()) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_start_bid_date_err' })));
      return;
    }
    if (
      new Date(itemGeneralData?.deadlineBid).getTime() <
      new Date(itemGeneralData?.startBidDate).getTime() + 10 * 60 * 1000
    ) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_end_bid_date_err' })));
      return;
    }
    if (itemGeneralData?.description?.length < 10) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_desc_err' })));
      return;
    }
    if (itemGeneralData?.categoryId === -1) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_ctg_err' })));
      return;
    }
    if (itemImages?.length < 1) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_general_img_err' })));
      return;
    }
    if (
      isNaN(itemSpecificationData?.length) ||
      isNaN(itemSpecificationData?.width) ||
      isNaN(itemSpecificationData?.height) ||
      isNaN(itemSpecificationData?.weight)
    ) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_item_spec_err_nan' })));
      return;
    }
    if (
      itemSpecificationData?.length < 1 ||
      itemSpecificationData?.width < 1 ||
      itemSpecificationData?.height < 1 ||
      itemSpecificationData?.length > 500 ||
      itemSpecificationData?.width > 500 ||
      itemSpecificationData?.height > 500
    ) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_item_spec_err_below_zero' })));
      return;
    }
    if (itemSpecificationData?.weight < 1 || itemSpecificationData?.weight > 500000) {
      dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_item_spec_err_weight_below_zero' })));
      return;
    }

    const formData = new FormData();

    if (id) {
      formData.append('id', id);
      formData.append(
        'imageArray',
        encryptDataAES(JSON.stringify(itemImages?.filter((image) => image?.url !== '').map((image) => image.url)))
      );
    }
    formData.append('itemGeneralData', encryptDataAES(JSON.stringify(itemGeneralData)));
    formData.append('itemSpecificationData', encryptDataAES(JSON.stringify(itemSpecificationData)));

    for (let index = 0; index < itemImages.length; index++) {
      const image = itemImages[index];
      if (image?.imageData) formData.append('images', image?.imageData);
    }

    dispatch(
      saveAuctionData(formData, Boolean(id), (err, createdId) => {
        if (err) return;

        if (createdId) navigate(`/edit-auction/${createdId}`);
        dispatch(showPopup(pageTitle, intl.formatMessage({ id: 'auction_form_success_save' })));
      })
    );
  };

  // TODO: add delete popup and functions

  const deleteOnConfirmation = (isDelete) => {
    if (isDelete) {
      dispatch(
        deleteAuctionData({ id }, (err) => {
          if (!err) navigate('/my-auction');
        })
      );
    } else {
      setIsShowDeletePopup(false);
    }
  };

  useEffect(() => {
    if (id && detailData) {
      setItemGeneralData(detailData?.itemGeneralData);
      setItemSpecificationData(detailData?.itemSpecificationData);
      setIsEditable(detailData?.isEditable);
      setIsDeletable(detailData?.isDeletable);
      setItemImages(detailData?.itemImages?.map((image) => ({ id: uuid(), imageData: null, url: image })));
    } else {
      setIsEditable(true);
      setIsDeletable(true);
    }
  }, [detailData]);
  useEffect(() => {
    setIsLoadingCategory(true);
    dispatch(
      getCategory(
        () => {
          setIsLoadingCategory(false);
        },
        () => {
          navigate('/my-auction');
        }
      )
    );
    if (id) {
      dispatch(getAuctionDetailData({ id }));
    }
  }, []);

  return (
    <div className={classes.mainContainer}>
      <PopupConfirmation
        isOpen={isShowDeletePopup}
        onConfirmation={deleteOnConfirmation}
        data={itemGeneralData?.itemName}
        message={intl.formatMessage({ id: 'profile_address_del_confirmations' })}
      />
      <div className={classes.header}>
        <button type="button" className={classes.button} onClick={() => navigate('/my-auction')}>
          <ArrowBackIosNewIcon className={classes.icon} />
        </button>
        <h1 className={classes.pageTitle}>
          {id ? <FormattedMessage id="auction_form_title_edit" /> : <FormattedMessage id="auction_form_title_new" />}
        </h1>
      </div>
      <div className={classes.inputFormContainer}>
        <h3 className={classes.inputFormTitle}>
          <FormattedMessage id="auction_form_general" />
        </h3>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              <FormattedMessage id="auction_form_general_itm_name" />
            </label>
            <input
              id="itemName"
              type="text"
              className={classes.input}
              value={itemGeneralData?.itemName}
              maxLength={255}
              onChange={(e) =>
                setItemGeneralData(
                  produce((draft) => {
                    draft.itemName = e.target.value;
                  })
                )
              }
              disabled={!isEditable}
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemStartBid" className={classes.label}>
              <FormattedMessage id="auction_form_general_itm_strt_bid" />
            </label>
            <input
              id="itemStartBid"
              min={0}
              type="number"
              className={classes.input}
              value={itemGeneralData?.startBid}
              onChange={(e) =>
                setItemGeneralData(
                  produce((draft) => {
                    draft.startBid = e.target.value;
                  })
                )
              }
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemStartBidDate" className={classes.label}>
              <FormattedMessage id="auction_form_general_itm_bid_strt" />
            </label>
            <input
              id="itemStartBidDate"
              type="datetime-local"
              className={classes.input}
              value={itemGeneralData?.startBidDate}
              onChange={(e) =>
                setItemGeneralData(
                  produce((draft) => {
                    draft.startBidDate = e.target.value;
                  })
                )
              }
              disabled={!isEditable}
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemDeadline" className={classes.label}>
              <FormattedMessage id="auction_form_general_itm_bid_ddl" />
            </label>
            <input
              id="itemDeadline"
              type="datetime-local"
              className={classes.input}
              value={itemGeneralData?.deadlineBid}
              onChange={(e) =>
                setItemGeneralData(
                  produce((draft) => {
                    draft.deadlineBid = e.target.value;
                  })
                )
              }
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemCategory" className={classes.label}>
              <FormattedMessage id="auction_form_general_itm_ctg" />
            </label>
            {isLoadingCategory ? (
              <div className={classes.loadingContainer}>
                <p className={classes.text}>
                  <FormattedMessage id="loading" />
                </p>
              </div>
            ) : (
              <select
                id="itemCategory"
                className={classes.input}
                value={itemGeneralData?.categoryId}
                onChange={(e) =>
                  setItemGeneralData(
                    produce((draft) => {
                      draft.categoryId = e.target.value;
                    })
                  )
                }
                disabled={!isEditable}
              >
                <option value={-1}>
                  <FormattedMessage id="auction_form_general_itm_ctg_op" />
                </option>
                {categories?.map((category) => (
                  <option value={category?.id} key={category?.id}>
                    {intl.formatMessage({ id: 'lang' }) === 'id' ? category?.nameId : category?.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemDesc" className={classes.label}>
              <FormattedMessage id="auction_form_general_itm_desc" />
            </label>
            <textarea
              data-type="area"
              id="itemDesc"
              type="text"
              className={classes.input}
              value={itemGeneralData?.description}
              maxLength={500}
              onChange={(e) =>
                setItemGeneralData(
                  produce((draft) => {
                    draft.description = e.target.value;
                  })
                )
              }
              disabled={!isEditable}
            />
          </div>
        </div>
        <span className={classes.spacer} />
        <h3 className={classes.inputFormTitle}>
          <FormattedMessage id="auction_form_spec" />
        </h3>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemlen" className={classes.label}>
              <FormattedMessage id="auction_form_spec_length" />
            </label>
            <input
              id="itemlen"
              min={0}
              type="number"
              className={classes.input}
              value={itemSpecificationData?.length}
              onChange={(e) => onChangeInputItmSpec('length', e.target.value)}
              disabled={!isEditable}
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemWidth" className={classes.label}>
              <FormattedMessage id="auction_form_spec_width" />
            </label>
            <input
              id="itemWidth"
              min={0}
              type="number"
              className={classes.input}
              value={itemSpecificationData?.width}
              onChange={(e) => onChangeInputItmSpec('width', e.target.value)}
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemHeight" className={classes.label}>
              <FormattedMessage id="auction_form_spec_height" />
            </label>
            <input
              id="itemHeight"
              min={0}
              type="number"
              className={classes.input}
              value={itemSpecificationData?.height}
              onChange={(e) => onChangeInputItmSpec('height', e.target.value)}
              disabled={!isEditable}
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemWeight" className={classes.label}>
              <FormattedMessage id="auction_form_spec_weight" />
            </label>
            <input
              id="itemWeight"
              min={0}
              type="number"
              className={classes.input}
              value={itemSpecificationData?.weight}
              onChange={(e) => onChangeInputItmSpec('weight', e.target.value)}
              disabled={!isEditable}
            />
          </div>
        </div>
        <span className={classes.spacer} />
        <h3 className={classes.inputFormTitle}>
          <FormattedMessage id="auction_form_img" />
        </h3>
        <div className={classes.imageInputContainer}>
          <div className={classes.imagePreviewContainer}>
            {previewImage ? (
              <img
                className={classes.image}
                src={previewImage?.url !== '' ? previewImage?.url : URL.createObjectURL(previewImage?.imageData)}
                alt="Error"
              />
            ) : (
              <div className={classes.image}>
                <p className={classes.text}>
                  <FormattedMessage id="auction_form_img_prev_empty" />
                </p>
              </div>
            )}
            {errImgMsg?.length > 0 && (
              <div className={classes.errMsg}>
                {errImgMsg?.map((msg) => (
                  <p className={classes.text} key={msg}>
                    {msg}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className={classes.imageInputFormContainer}>
            <div className={classes.imageListContainer}>
              {itemImages?.map((image, index) => (
                <div className={classes.imageListDataContainer} key={image?.id}>
                  <div className={classes.imageContainer} onClick={() => setPreviewImage(image)}>
                    <img
                      className={classes.image}
                      src={image?.url !== '' ? image?.url : URL.createObjectURL(image?.imageData)}
                      alt="Error"
                      data-active={previewImage?.id === image?.id}
                    />
                  </div>
                  <button
                    type="button"
                    className={classes.button}
                    data-type="red"
                    onClick={() => deleteImage(index)}
                    disabled={!isEditable}
                  >
                    <DeleteIcon className={classes.icon} />
                  </button>
                </div>
              ))}
              {isShowFileForm && isEditable && itemImages.length < 8 && (
                <div className={classes.buttonContainer}>
                  <label htmlFor="imageInput" className={classes.imageInputBtn} data-type="clean">
                    <AddPhotoAlternateIcon />
                  </label>
                  <input
                    type="file"
                    accept="image/jpg, image/png, image/jpeg"
                    multiple
                    hidden
                    id="imageInput"
                    onChange={addImageData}
                    disabled={!isEditable}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.buttons}>
        <button type="button" className={classes.button} disabled={!isEditable} onClick={saveDataToDb}>
          <FormattedMessage id="save" />
        </button>
        {id && (
          <button
            type="button"
            className={classes.button}
            data-type="red"
            disabled={!isDeletable}
            onClick={() => setIsShowDeletePopup(true)}
          >
            <FormattedMessage id="delete" />
          </button>
        )}
      </div>
    </div>
  );
};

AuctionForm.propTypes = {
  detailData: PropTypes.object,
  categories: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  detailData: selectAuctionDetailData,
  categories: selectCategory,
});

export default connect(mapStateToProps)(AuctionForm);
