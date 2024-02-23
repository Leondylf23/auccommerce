import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import classes from './style.module.scss';

const AuctionForm = ({ detailData }) => {
  const { id } = useSearchParams();

  const [itemGeneralData, setItemGeneralData] = useState();
  const [itemSpecificationData, setItemSpecificationData] = useState();
  const [itemImages, setItemImages] = useState([]);
  const [isShowFileForm, setIsShowFileForm] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const addImageData = (e) => {
    const { files } = e.target;
    const addedFiles = [];
    let isAnyError = false;

    setIsShowFileForm(false);

    if (files.length > 8 - itemImages.length) {
      console.log('error len');
      return;
    }

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      if (file.type.split('/')[0] === 'image') {
        addedFiles.push({
          url: '',
          imageData: file,
        });
      } else {
        isAnyError = true;
      }
    }

    if (isAnyError) console.log('any error');
    if (addedFiles.length > 0) {
      setItemImages((prevVal) => [...prevVal, ...addedFiles]);
      setPreviewImage(addedFiles[0]);
    }
    setIsShowFileForm(true);
  };

  const deleteImage = (selectedIndex) => {
    setItemImages((prevVal) => prevVal.filter((_, index) => index !== selectedIndex));
  };

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.pageTitle}>{id ? 'Auction Detail' : 'Create New Auction'}</h1>
      <div className={classes.inputFormContainer}>
        <h3 className={classes.inputFormTitle}>General Information</h3>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Item Name
            </label>
            <input id="itemName" type="text" className={classes.input} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Starting Bid Price (Rp.)
            </label>
            <input id="itemName" min={0} type="number" className={classes.input} />
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Bid Deadline
            </label>
            <input id="itemName" type="datetime-local" className={classes.input} />
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Descirption
            </label>
            <textarea data-type="area" id="itemName" type="text" className={classes.input} />
          </div>
        </div>
        <span className={classes.spacer} />
        <h3 className={classes.inputFormTitle}>Item Physical Spesification</h3>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Item Length (Centimeters)
            </label>
            <input id="itemName" min={0} type="number" className={classes.input} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Item Width (Centimeters)
            </label>
            <input id="itemName" min={0} type="number" className={classes.input} />
          </div>
        </div>
        <div className={classes.dividerContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Item Height (Centimeters)
            </label>
            <input id="itemName" min={0} type="number" className={classes.input} />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="itemName" className={classes.label}>
              Item Weight (Grams)
            </label>
            <input id="itemName" min={0} type="number" className={classes.input} />
          </div>
        </div>
        <span className={classes.spacer} />
        <h3 className={classes.inputFormTitle}>Item Images</h3>
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
                <p className={classes.text}>Add or click an image to preview.</p>
              </div>
            )}
          </div>
          <div className={classes.imageInputFormContainer}>
            <div className={classes.imageListContainer}>
              {itemImages?.map((image, index) => (
                <div className={classes.imageListDataContainer}>
                  <div className={classes.imageContainer} onClick={() => setPreviewImage(image)}>
                    <img
                      className={classes.image}
                      src={image?.url !== '' ? image?.url : URL.createObjectURL(image?.imageData)}
                      alt="Error"
                    />
                  </div>
                  <button type="button" className={classes.button} data-type="clean" onClick={() => deleteImage(index)}>
                    <DeleteIcon />
                  </button>
                </div>
              ))}
              {isShowFileForm && itemImages.length < 8 && (
                <div className={classes.buttonContainer}>
                  <label htmlFor="imageInput" className={classes.imageInputBtn} data-type="clean">
                    <AddPhotoAlternateIcon />
                  </label>
                  <input type="file" accept="image/*" multiple hidden id="imageInput" onChange={addImageData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.buttons}>
        <button type="button" className={classes.button}>
          Save
        </button>
        {id && (
          <button type="button" className={classes.button} data-type="red">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

AuctionForm.propTypes = {
  detailData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps)(AuctionForm);
