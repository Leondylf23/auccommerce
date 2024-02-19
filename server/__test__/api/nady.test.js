const Request = require("supertest");
const _ = require("lodash");

const db = require("../../models");
const GeneralHelper = require("../../server/helpers/generalHelper");
const AuthPlugin = require("../../server/api/authUser");
const orderPlugin = require("../../server/api/orderinAja");
const MockUser = require("../fixtures/database/userData.json");
const encryptData = require("../../server/helpers/utilsHelper");
const MockProductsDetail = require("../fixtures/database/productDetail.json");

const cloudinary = require("../../server/services/cloudinary");

// Config
let apiUrl;
let server;
let body;
const bearerTokenCustomer =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwNzU5OTQ2MCwiZXhwIjoxNzM5MTM1NDYwfQ.4r3qbfjJhx4Qd0y6zpUrI1RBFRYZ1TBG8-EJjNxjPyM";
// let bearerTokenCustomerOther =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwNzYyNjk5MCwiZXhwIjoxNzM5MTYyOTkwfQ.lc6GiqO42jK42GnwWkLRj3yR0JS_wZSzKq0f3GZ78v0";

const bearerTokenBusiness =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5OTM0NywiZXhwIjoxNzM5MTM1MzQ3fQ.CPxI6wdRXDBhEe6DSIdAQQzOvrQBFrU93Zsxo7VNk60";
const bearerTokenBusinessOther =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzYyNjg1MSwiZXhwIjoxNzM5MTYyODUxfQ.L9IvQAF8L0v5Wwi-BMHgfBIeQ3ellin9amhOQs6wRP8";

// Databases
let mockUser;
let mockProducts;

// Spy DB
let getUser;
let createUser;
let updateUser;

let getProduct;
let createProduct;
let updateProduct;

// Spy function
let uploadCloudinary;

describe("User Json", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/auth", AuthPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Register User", () => {
    beforeEach(() => {
      apiUrl = "/auth/register";
      body = {
        fullname: encryptData.encryptData("raihan nady"),
        dob: encryptData.encryptData("2022-01-01"),
        email: encryptData.encryptData("JwS7w@example.com"),
        password: encryptData.encryptData("123456"),
        role: encryptData.encryptData("customer"),
        location: encryptData.encryptData("Jakarta"),
      };

      mockUser = { dataValues: _.cloneDeep(MockUser) };

      getUser = jest.spyOn(db.user, "findOne");
      createUser = jest.spyOn(db.user, "create");
    });

    test("Should Return 200: Create New User", async () => {
      getUser.mockResolvedValue({});
      createUser.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 422: Create New User With Exisiting Email", async () => {
      getUser.mockResolvedValue(mockUser);
      createUser.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(422)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 400: Body Not Matched", async () => {
      body = { ...body, email: undefined };

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 500: Failed to Create User", async () => {
      getUser.mockResolvedValue({});
      createUser.mockResolvedValue(null);

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(500)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });

  describe("Login User", () => {
    beforeEach(() => {
      apiUrl = "/auth/login";
      body = {
        email: "U2FsdGVkX1+Kbv4eat40YMi1D8hWR92Of4bawIxapOQ=",
        password: "U2FsdGVkX18swOXDrfnCZBcMZZZRTzNZHnhX1/ZlvLc=",
      };

      mockUser = { dataValues: _.cloneDeep(MockUser) };

      getUser = jest.spyOn(db.user, "findOne");
    });

    test("Should Return 200: Login User", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
          expect(res.body?.data?.token).toBeTruthy();
          expect(res.body?.data?.userData).toBeTruthy();
        });
    });

    test("Should Return 401: Login with nonexisted email", async () => {
      getUser.mockResolvedValue({});

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 401: Login with wrong password", async () => {
      body = {
        ...body,
        password: "U2FsdGVkX1+Kbv4eat40YMi1D8hWR92Of4bawIxapOQ=",
      };
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(401)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 400: Body Not Matched", async () => {
      body = { ...body, email: undefined };

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });

  describe("Reset User Password", () => {
    beforeEach(() => {
      apiUrl = "/auth/reset-password";
      body = {
        email: "test@a.ab",
      };

      mockUser = { dataValues: _.cloneDeep(MockUser), update: jest.fn() };

      getUser = jest.spyOn(db.user, "findOne");
      updateUser = jest.spyOn(mockUser, "update");
    });

    test("Should Return 200: Successfully Reset Password", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue({ ...mockUser, password: "new passord" });

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
          expect(res.body?.data?.newPassword).toBeTruthy();
        });
    });

    test("Should Return 500: Password Not Updated", async () => {
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue({});

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(500)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 422: Reset using unknown email", async () => {
      getUser.mockResolvedValue({});

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(422)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 400: Bad Request Data", async () => {
      body = {
        email: "",
      };

      await Request(server)
        .post(apiUrl)
        .send(body)
        .expect(400)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });
  });
});

describe("Product Json", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/orderin-aja", orderPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Business Create Product", () => {
    beforeEach(() => {
      apiUrl = "/orderin-aja/product/create";
      body = {
        title: "Test Create",
        price: 10000,
        description: "test desc",
      };

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
      createProduct = jest.spyOn(db.product, "create");
    });

    test("Should Return 200: Create Business Product Data", async () => {
      createProduct.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)
        .attach("imageData", filePath)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Business Product Data Without Params", async () => {
      createProduct.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Business Product Data Without Image", async () => {
      createProduct.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Business Product Data Without Login", async () => {
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      const res = await Request(server).put(`${apiUrl}`).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Business Product Data Using Customer Account", async () => {
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)
        .attach("imageData", filePath)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Business Product Data Create Failed", async () => {
      createProduct.mockResolvedValue(null);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)
        .attach("imageData", filePath)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Business Product Data Upload Failed", async () => {
      createProduct.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue(null);

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)

        .attach("imageData", filePath)
        .expect(500);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Edit Product", () => {
    beforeEach(() => {
      apiUrl = "/orderin-aja/product/edit";
      body = {
        id: 1,
        title: "Test Create",
        price: 10000,
        description: "test desc",
      };

      mockProducts = {
        dataValues: _.cloneDeep(MockProductsDetail),
        update: jest.fn(),
      };
      getProduct = jest.spyOn(db.product, "findOne");
      updateProduct = jest.spyOn(mockProducts, "update");
      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    });

    test("Should Return 200: Edit Business Product Data", async () => {
      getProduct.mockResolvedValue(mockProducts);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateProduct.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)
        .attach("imageData", filePath)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 200: Edit Business Product Data Without Image", async () => {
      getProduct.mockResolvedValue(mockProducts);
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)

        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Edit Business Product Data Not Found", async () => {
      getProduct.mockResolvedValue({});
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateProduct.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)

        .attach("imageData", filePath)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Edit Business Product Data Without Login", async () => {
      getProduct.mockResolvedValue(mockProducts);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server).patch(`${apiUrl}`).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Edit Business Product Data Using Customer Account", async () => {
      getProduct.mockResolvedValue(mockProducts);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateProduct.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)

        .attach("imageData", filePath)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Edit Business Product Data Using Other Account", async () => {
      getProduct.mockResolvedValue(mockProducts);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateProduct.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)

        .attach("imageData", filePath)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Edit Business Product Data Without Params", async () => {
      getProduct.mockResolvedValue(mockProducts);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Edit Business Product Data Upload Image Failed", async () => {
      getProduct.mockResolvedValue(mockProducts);
      uploadCloudinary.mockResolvedValue(null);
      updateProduct.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("price", body?.price)
        .field("description", body?.description)

        .attach("imageData", filePath)
        .expect(500);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Delete Product", () => {
    beforeEach(() => {
      apiUrl = "/orderin-aja/product/delete";
      body = {
        id: 1,
      };

      getProduct = jest.spyOn(db.product, "findOne");
      mockProducts = {
        dataValues: _.cloneDeep(MockProductsDetail),
        update: jest.fn(),
      };
      updateProduct = jest.spyOn(mockProducts, "update");
    });

    test("Should Return 200: Business Delete Product Data", async () => {
      getProduct.mockResolvedValue(mockProducts);
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Business Delete Product Data Not Found", async () => {
      getProduct.mockResolvedValue({});
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Business Delete Product Data Without Params", async () => {
      getProduct.mockResolvedValue(mockProducts);
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Product Data Without Login", async () => {
      getProduct.mockResolvedValue(mockProducts);
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Product Data Using Customer Account", async () => {
      getProduct.mockResolvedValue(mockProducts);
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Product Data Using Other Account", async () => {
      getProduct.mockResolvedValue(mockProducts);
      updateProduct.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });
});
