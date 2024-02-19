import { produce } from 'immer';
import { SET_PRODUCT_DATA } from './constants';

export const initialState = {
  productData: null,
  // {
  //     title: 'Event Bootcamp Phincon',
  //     location: 'Jakarta Selatan',
  //     organizer: 'Phincon',
  //     image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAADmCAYAAADBavm7AAAEsUlEQVR42u3d7WqrMACA4d7/LQ2xiDgkCBKEIoLsTnL+nMI2zs7cR9tonh/PDZi+pCZRTy8vLwnIy8lFAGECwgRhAsIEYQLCBGG6ECBMQJggTECYIExAmCBMQJiAMEGYgDBBmIAwQZiAMAFhgjABYYIwAWGCMAFhAsIEYQLCBGECwgRhAsIEhAnCBIQJwgSECcIEhAkIE4QJCBOECQgThAkIExAmCBMQJggTECYIExAmIEwQJiBMECYgTBAmIEy+Y13XdLlc3nBdhMmdzPOcxnFMfd+ntm3T09PTp6qqSm3bphBCijGmZVlcS2HyU8uypBBCqut6U4hbNE2TxnFM67q6xsLkq0H2ff9rMX40mw7DIFBhssU4jqmqqptG+Vpd1+5Lhcn/FnFuPUv+T4zROAiT91E2TfOwKK+GYTAewuSq67qHR2nmFCavDMOQTZRX8zwbG2GWvTeZW5TXBSGrtcIs1taDAu43hcmdXC6XbKO87nOaNYVptjRrIszHn+zJPcrrvabxEmYxQgi7CNMKrTCL8puH0m8thGDMhOlvbG6apjFuwrQamyPjJswinh7ZW5i2TYTpCF6GPBYmTGEKE2EKU5jCRJgIU5jCFCYHDtOqrDDtY9rHRJjCFKYwESbCFKYwhYkwEaYwhSlMhIkwhSlMhClMYQoTYSJMYQpTmBwxzPP5bNyEWYY9hdm2rTETpjCFiTAfJIeP1PpMgjB555GfdP+qaZqMmTDLEGP0kDTCzM26ru4vEaa/s98TYzRWwrSf6cO1CDMD5/PZV74QZm5y/o7JsizGSJjlLgJVVWXRB2FaBLJ3KUw+lduHbB1aFyZ/dV1niwRh2jqxRSJMNmnb1oF1hGnWNFsKk+xnTfeWwuQD8zxbiUWYOQoh+DAtwiz9NNDz87PrLky2mKbJgo8wXYRS/9L6CytMMntpl1VYYfLNM7S3ejdQVVVpmiaPdgmTLVsl4zimruvuuvhTVVXqui6N4yhUYXJd5AkhpLqusznEXtd1CiGkeZ6NkTDLmhlzi/GzSM2kwjysGOOu3sD+r7caWDAS5mEOCwzDkOXrQ35yTzoMg/1PYe5zRTWEcKggPwrU31xh7iLIPX2X5Lf0fW8GFWa+f1lLC9JfXGG6h9xZoH4fwnzYKusetjweudViFVeYd30FiCC3a5rGYXlh3jbIHF6Yted9UIEKU5ACFaYgEagwBSlQYZZ0uFyQjw3UEy3CfKP0wwE5sQcqzDTP866f+DjyFkvps2exYcYYndjJ/ARRyQcUTqVG6ce/D6XGeRIl4hRmES9SxjtwhfmFJ0HcU+77nrOkR8qKCbPEB5iP+EC2MA82W/phH0Mps+bJgg8WgoTpZA9OBglTmMIUpjARpjCFKUxhChNhClOYCFOYCFOYwkSYwhSmMIUpTIQpTGEKU5jCRJjCBC/jAoQJCBOECQgThAkIE4QJCBMQJggTECYIExAmCBMQJiBMECYgTBAmIEwQJiBMQJggTECYIExAmCBMQJiAMEGYgDBBmIAwQZiAMAFhgjABYYIwAWGCMAFhAsIEYQLCBGECwgRhAsIEhAnCBIQJwgSECcIEhAkIE4QJCBOECQgThAnc3R8ikInaYdta0QAAAABJRU5ErkJggg==',
  //     defaultPrice: 6800000,
  //     variants: [
  //         {
  //             id: 'adwad',
  //             variantName: 'Basic',
  //             price: 1000000,
  //             isDefault: false,
  //         },
  //         {
  //             id: 'adwad2',
  //             variantName: 'Intermediate',
  //             price: 3500000,
  //             isDefault: false,
  //         },
  //         {
  //             id: 'adwada',
  //             variantName: 'Advanced',
  //             price: 6800000,
  //             isDefault: true,
  //         },
  //     ],
  // },
};

export const storedKey = [];

const productDetailReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PRODUCT_DATA:
        draft.productData = action.data;
        break;
    }
  });

export default productDetailReducer;
