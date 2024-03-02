const Router = require("express").Router();
const Boom = require("boom");

const ValidationTransaction = require("../helpers/validationTransaction");
const TransactionHelper = require("../helpers/transactionHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const { decryptData } = require("../helpers/utilsHelper");

const fileName = "server/api/myBids.js";

const getBidId = async (request, reply) => {
  try {
    ValidationTransaction.transactionCodeValidation(request.query);

    const response = await TransactionHelper.getRedirectData(
      request?.query
    );

    const doc = `
        <html>
            <body>
            <h1 style="margin-bottom: 30px;">${request?.query?.transactioncode} is success</h1>
            <h2 style="">Redirecting...</h2>
            </body>
            <script>
                setTimeout(() => {
                    window.location.href = "http://localhost:5050/my-bids/${response?.bidId}";
                }, 3000);
            </script>
        </html>
    `
    return reply.send(doc);
  } catch (err) {
    console.log([fileName, "Get Redirect Bid API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Authenticated Only Routes
Router.get("/success", getBidId);

module.exports = Router;
