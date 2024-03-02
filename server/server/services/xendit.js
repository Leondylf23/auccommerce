const { PaymentRequest } = require("xendit-node/payment_request");
require("dotenv").config({ path: `${__dirname}/../.env` });

const successPaymentRedirect = "http://localhost:8080/api/transaction/success";
const xenditPaymentRequestClient = new PaymentRequest({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

const paymentMethods = [
  {
    id: 1,
    category: "e_money",
    methodName: "Shopee Pay",
    logo: "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709399554/shopee_okdxgt.svg",
    paymentMetadata: {
      ewallet: {
        channelProperties: {
          successReturnUrl: successPaymentRedirect,
        },
        channelCode: "SHOPEEPAY",
      },
      reusability: "ONE_TIME_USE",
      type: "EWALLET",
    },
  },
  {
    id: 2,
    category: "e_money",
    methodName: "OVO",
    logo: "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709399298/ovo_w5iani.png",
    paymentMetadata: {
      ewallet: {
        channelProperties: {
          successReturnUrl: successPaymentRedirect,
        },
        channelCode: "SHOPEEPAY",
      },
      reusability: "ONE_TIME_USE",
      type: "EWALLET",
    },
  },
  {
    id: 3,
    category: "e_money",
    methodName: "Gopay",
    logo: "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709399298/gopay_lzlehh.svg",
    paymentMetadata: {
      ewallet: {
        channelProperties: {
          successReturnUrl: successPaymentRedirect,
        },
        channelCode: "SHOPEEPAY",
      },
      reusability: "ONE_TIME_USE",
      type: "EWALLET",
    },
  },
  {
    id: 4,
    category: "e_money",
    methodName: "Dana",
    logo: "https://res.cloudinary.com/dwyzuwtel/image/upload/v1709399298/dana_wz8nra.svg",
    paymentMetadata: {
      ewallet: {
        channelProperties: {
          successReturnUrl: successPaymentRedirect,
        },
        channelCode: "SHOPEEPAY",
      },
      reusability: "ONE_TIME_USE",
      type: "EWALLET",
    },
  },
];

const getPaymentMethodDataById = (id) => {
  const data = paymentMethods.find((v) => v.id === id);

  return data ? data?.paymentMetadata : null;
};

const getPaymentMethodsData = () => paymentMethods;

/**
 *
 * @param {number} paymentMethod Require payment metode id
 * @param {number} amount Require amount of payment
 * @param {object | null} metadata Optional metadata such as { sku: 'number' }
 * @param {number} refId Require refId, can use transaction code as refId
 * @param {number} userId Require user id
 * @returns {object} Response of xendit API
 */
const requestPaymentXendit = async (
  paymentMethod,
  amount,
  metadata,
  refId,
  userId,
  tokenSuccess
) => {
  const paymentMethodData = getPaymentMethodDataById(paymentMethod);
  if (!paymentMethodData) throw new Error("Payment Method not found!");

  paymentMethodData.reference_id = `pm-level-${refId}`;
  paymentMethodData.ewallet.channelProperties.successReturnUrl = `${successPaymentRedirect}?transactioncode=${refId}&token=${tokenSuccess}`;

  const data = {
    country: "ID",
    amount,
    metadata,
    paymentMethod: paymentMethodData,
    currency: "IDR",
    referenceId: refId,
    customer_id: userId,
  };

  const response = await xenditPaymentRequestClient.createPaymentRequest({
    data,
  });

  return response;
};

const getPaymentRequestData = async (id) => {
  const response = await xenditPaymentRequestClient.getPaymentRequestByID({
    paymentRequestId: id,
  });

  return response;
};

module.exports = {
  getPaymentMethodsData,
  getPaymentMethodDataById,

  requestPaymentXendit,
  getPaymentRequestData,
};
