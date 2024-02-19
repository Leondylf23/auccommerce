const Request = require("supertest");
const QS = require("qs");
const _ = require("lodash");

const db = require("../../models");
const cloudinary = require("../../server/services/cloudinary");
const GeneralHelper = require("../../server/helpers/generalHelper");
const OrderinAjaPlugin = require("../../server/api/orderinAja");
const AuthPlugin = require("../../server/api/authUser");

// Mock Datas JSON
const MockProduct = require("../fixtures/database/allProduct.json");
const MockBesSeller = require("../fixtures/database/bestSeller.json");
const MockUser = require("../fixtures/database/userData.json");

// Config
let apiUrl;
let server;
let query;
let body;

// Databases
let mockProduct;
let mockBestSeller;

// Spy DB
let getProduct;
let getBestSeller;

// Spy function

describe("Product Json", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/orderin-aja", OrderinAjaPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("All Product", () => {
    beforeEach(() => {
      apiUrl = "/orderin-aja/product";

      mockProduct = _.cloneDeep(MockProduct);

      getProduct = jest.spyOn(db.product, "findAll");
    });

    test("Should Return 200: Get All Product Public", async () => {
      query = {
        productName: "test",
      };
      getProduct.mockResolvedValue(mockProduct);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Get All Product Public Error Data Not Array", async () => {
      getProduct.mockResolvedValue({});

      const res = await Request(server).get(apiUrl).expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get All Product Public With known Params", async () => {
      query = {
        productName: "SoyG2Kiz9L",
      };
      getProduct.mockResolvedValue(mockProduct);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 200: Get All Product Public With Unknown Params", async () => {
      query = {
        productNameTest: "test",
      };
      getProduct.mockResolvedValue(mockProduct);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400);

      expect(res.body).toBeTruthy();
    });
  });

  describe("All Best Seller", () => {
    beforeEach(() => {
      apiUrl = "/orderin-aja/product/best-seller";

      mockBestSeller = _.cloneDeep(MockBesSeller);

      getBestSeller = jest.spyOn(db.order, "findAll");
    });

    test("Should Return 200: Get All Best Seller", async () => {
      getBestSeller.mockResolvedValue(mockBestSeller);

      const res = await Request(server).get(apiUrl).expect(200);

      expect(res.body).toBeTruthy();
    });
  });
});

// PROFILE

// Config
let bearerToken;

// Databases
let mockUser;

// Spy DB
let getUser;
let updateUser;

// Spy function
let uploadCloudinary;
describe("User Json", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/auth", AuthPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("User Profile", () => {
    beforeEach(() => {
      apiUrl = "/auth/profile";
      body = {};

      // Token with no exp
      bearerToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5MTY3MiwiZXhwIjoxNzM5MTI3NjcyfQ.FbIykiO6Jx5zDW60BE26JnbxwXsDc3q-slDtvvFVcyM";

      mockUser = { dataValues: _.cloneDeep(MockUser) };

      getUser = jest.spyOn(db.user, "findOne");
    });

    test("Should Return 200: Get User Profile Data", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
          expect(res.body?.data).toBeTruthy();
        });
    });

    test("Should Return 422: User data not found", async () => {
      getUser.mockResolvedValue({});

      await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerToken)
        .expect(422)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 401: Using Invalid Token", async () => {
      getUser.mockResolvedValue({});

      bearerToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDc1ODk1NTQsImV4cCI6MTcwNzYzMjc1NH0.3MH8VzMkEfnCUaECx-A1ITAKT7C-k_GbogfV7A_Ar5g";

      await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerToken)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 401: User not logined", async () => {
      await Request(server)
        .get(apiUrl)
        .send(body)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });

  describe("Change Password", () => {
    beforeEach(() => {
      apiUrl = "/auth/change-password";
      body = {
        oldPassword: "U2FsdGVkX1/EEJD9Via90Dyb5dmRSwbOcXO/p002Kn8=",
        newPassword: "U2FsdGVkX18BnxMAGMfT6dwpYJ9Td7vOLTVGRjAueYE=",
      };

      // Token with no exp
      bearerToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5MTY3MiwiZXhwIjoxNzM5MTI3NjcyfQ.FbIykiO6Jx5zDW60BE26JnbxwXsDc3q-slDtvvFVcyM";

      mockUser = { dataValues: _.cloneDeep(MockUser), update: jest.fn() };

      getUser = jest.spyOn(db.user, "findOne");
      updateUser = jest.spyOn(mockUser, "update");
    });

    test("Should Return 200: Successfully Change Password", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue({ ...mockUser, password: "updated" });

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 500: Password Not Updated", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue({});

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(500)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 422: Profile data not found", async () => {
      getUser.mockResolvedValue({});

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(422)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 401: Wrong old password", async () => {
      body = {
        ...body,
        oldPassword: "U2FsdGVkX1+0aSxGRuqp4We1lSnvoqLckdMd3a106N4=",
      };

      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 401: User not logined", async () => {
      await Request(server)
        .patch(apiUrl)
        .send(body)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 400: Bad Request Data", async () => {
      body = {
        oldPassword: "U2FsdGVkX1+0aSxGRuqp4We1lSnvoqLckdMd3a106N4=",
      };

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });

  describe("Update User Profile Data", () => {
    beforeEach(() => {
      apiUrl = "/auth/profile/update";
      body = {
        fullname: "test edit name",
        dob: "2012-01-01",
      };

      // Token with no exp
      bearerToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5MTY3MiwiZXhwIjoxNzM5MTI3NjcyfQ.FbIykiO6Jx5zDW60BE26JnbxwXsDc3q-slDtvvFVcyM";

      mockUser = { dataValues: _.cloneDeep(MockUser), update: jest.fn() };

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
      getUser = jest.spyOn(db.user, "findOne");
      updateUser = jest.spyOn(mockUser, "update");
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    test("Should Return 200: Successfully Change Profile Data", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue(mockUser);

      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const filePath = "./__test__/fixtures/file/en.png";

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .field("fullname", body?.fullname)
        .field("dob", body?.dob)
        .attach("imageData", filePath)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 500: Profile not updated", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue({});

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .field("fullname", body?.fullname)
        .field("dob", body?.dob)
        .expect(500)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 500: Change Profile Data Image Not Uploaded", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue(mockUser);

      uploadCloudinary.mockResolvedValue(null);

      const filePath = "./__test__/fixtures/file/en.png";

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .field("fullname", body?.fullname)
        .field("dob", body?.dob)
        .attach("imageData", filePath)
        .expect(500)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 422: Unknown Profile Data", async () => {
      getUser.mockResolvedValue({});

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(422)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 401: User not logined", async () => {
      await Request(server)
        .patch(apiUrl)
        .send(body)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 400: Bad Request Data", async () => {
      body = {
        fullname: "test name",
      };

      await Request(server)
        .patch(apiUrl)
        .set("Authorization", bearerToken)
        .send(body)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });
});
