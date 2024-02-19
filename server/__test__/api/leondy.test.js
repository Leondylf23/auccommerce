const Request = require("supertest");
const QS = require("qs");
const _ = require("lodash");

const db = require("../../models");
const GeneralHelper = require("../../server/helpers/generalHelper");
const OrderinAja = require("../../server/api/orderinAja");

// Mock Datas JSON
const MockProductDetail = require("../fixtures/database/productDetail.json");
const MockOrder = require("../fixtures/database/allOrder.json");
const MockOrderDetail = require("../fixtures/database/orderDetail.json");

// Config
let apiUrl;
let server;
let query;
let body;
const bearerTokenCustomer =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwNzk4NDAxOSwiZXhwIjoxNzM5NTIwMDE5fQ.XxlrA3ZLALtqs__agZb5d-FsDdnUHEh0p3goXM8vyic";
// let bearerTokenCustomerOther =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwNzYyNjk5MCwiZXhwIjoxNzM5MTYyOTkwfQ.lc6GiqO42jK42GnwWkLRj3yR0JS_wZSzKq0f3GZ78v0";

const bearerTokenBusiness =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzk4NDA0MiwiZXhwIjoxNzM5NTIwMDQyfQ.pY9ZU7uFGjWAI5q4p7Q-7GC7bv8isFue-JWkVWJof_c";
const bearerTokenBusinessOther =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzk4NDExMiwiZXhwIjoxNzM5NTIwMTEyfQ.-VplM5SXVhdkBaWIWrT6vVAPDwojWkGJlrNqt4xlvS8";

// Databases
let mockOrder;

// Spy DB
let getOrder;
let createOrder;
let updateTickets;

describe("Leondy Order Json", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/order-aja", OrderinAja);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Customer All Order Data", () => {
    beforeEach(() => {
      apiUrl = "/order-aja/order";

      mockOrder = _.cloneDeep(MockOrder);

      getOrder = jest.spyOn(db.order, "findAll");
    });

    test("Should Return 200: Get Customer All Order", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Get Customer All Order Wrong Data Format", async () => {
      getOrder.mockResolvedValue({});

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Customer All Order Without User Login", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server).get(apiUrl).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer All Order With Business Account", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Customer Order Detail", () => {
    beforeEach(() => {
      query = {
        id: 1,
      };
      apiUrl = "/order-aja/order/detail";

      mockOrder = _.cloneDeep(MockOrderDetail);

      getOrder = jest.spyOn(db.order, "findOne");
    });

    test("Should Return 200: Get Customer Order Detail", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Get Customer Order Detail Not Found", async () => {
      getOrder.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get Customer Order Detail Without Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer Order Detail Without Login", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer Order Detail Using Business Account", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business All Order Data", () => {
    beforeEach(() => {
      apiUrl = "/order-aja/order/business";

      mockOrder = _.cloneDeep(MockOrder);

      getOrder = jest.spyOn(db.order, "findAll");
    });

    test("Should Return 200: Get Business All Order", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business All Order Without Login", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server).get(apiUrl).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business All Order Using Customer Account", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Order Detail", () => {
    beforeEach(() => {
      query = {
        id: 1,
      };
      apiUrl = "/order-aja/order/business/detail";

      mockOrder = _.cloneDeep(MockOrderDetail);

      getOrder = jest.spyOn(db.order, "findOne");
    });

    test("Should Return 200: Get Business Order Detail", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Get Business Order Detail Not Found", async () => {
      getOrder.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get Business Order Detail Without Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business Order Detail Without Login", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business Order Detail Using Customer Account", async () => {
      getOrder.mockResolvedValue(mockOrder);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Customer Create Order", () => {
    beforeEach(() => {
      apiUrl = "/order-aja/order/create";
      body = {
        data: "U2FsdGVkX19GaI55v7YJrIelLa9seR3XbbTcpYndGMOn3wBU5H3sA4BiQ9l7NQjO3/ygE5f0ZebKKbsgBgCDDV+qlq+tJ67qtgn6fbDgFVLAxumZ/P1GwuEAhFnDqXBdgyQTOD/9eGlRt0FZBNyV3mHQzzCgFlvxPy7IvvGlUYWEN2mIExUIBWOeR0Quobom",
      };

      mockOrder = { dataValues: _.cloneDeep(MockProductDetail) };

      getOrder = jest.spyOn(db.product, "findOne");
      createOrder = jest.spyOn(db.order, "create");
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    test("Should Return 200: Create Customer Order Data", async () => {
      getOrder.mockResolvedValue(mockOrder);
      createOrder.mockResolvedValue('SUCCESS');

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Create Customer Order Data With Nonexisted Product", async () => {
      getOrder.mockResolvedValue({});

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Customer Order Data Order Data Creation Failed", async () => {
      getOrder.mockResolvedValue(mockOrder);
      createOrder.mockResolvedValue(null);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Customer Order Data Without Login", async () => {

      const res = await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Customer Order Data Using Business Account", async () => {

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Customer Order Data Without Params", async () => {

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Customer Order Data With Unknown Encrypt Data", async () => {
      body = {
        data: "adwadwaaw",
      };

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Customer Order Data With Invalid Encrypted Form Data", async () => {
      body = {
        data: "U2FsdGVkX18XxO22J2Qcfi67Rb63jV8JgN54MhLycdWRGQqZ6b3wYZinY4EJq2cCPV3w9ou0/VvgHveGiFeBS71eTkzGPp5i8kGhoBw5C0ATVPuAZ/uZ/BV5JIrEn6iPekM+9Z8q+5StfgAkw3CFpNBV0Ry89A8QAQ2tcinqEH3b6ilsPDdT9uGMyBGrccGgi2dXji4CnhsK+YoEK9g/0zsz03YfPvcLs2ec+8qxWBMhBIZXvvuDi4r0UPlAFk5+WFxJaUPOddhuG/BGaPsDVSnWUf04FfRmt4pYuH6Ycw0=",
      };

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(400);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Update Order Status", () => {
    beforeEach(() => {
      apiUrl = "/order-aja/order/status/update";
      body = {
        id: 1,
        isSuccess: true,
      };

      getOrder = jest.spyOn(db.order, "findOne");
      mockOrder = { ..._.cloneDeep(MockOrderDetail), update: jest.fn() };
      updateTickets = jest.spyOn(mockOrder, "update");
    });

    test("Should Return 200: Business Update Order Status Data", async () => {
      getOrder.mockResolvedValue(mockOrder);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 200: Business Update Order Status Data With isSuccess = false", async () => {
      getOrder.mockResolvedValue(mockOrder);
      updateTickets.mockResolvedValue("SUCCESS");

      body.isSuccess = false;

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Business Update Order Status Data Without Params", async () => {
      getOrder.mockResolvedValue(mockOrder);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Business Update Order Status Data Not Found", async () => {
      getOrder.mockResolvedValue({});
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Update Order Status Data Without Login", async () => {
      getOrder.mockResolvedValue(mockOrder);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Update Order Status Data With Customer Account", async () => {
      getOrder.mockResolvedValue(mockOrder);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Update Order Status Data With Other Account", async () => {
      getOrder.mockResolvedValue(mockOrder);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });
});
