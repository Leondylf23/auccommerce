const Request = require("supertest");
const QS = require("qs");
const _ = require("lodash");

const db = require("../../models");
const cloudinary = require("../../server/services/cloudinary");
const GeneralHelper = require("../../server/helpers/generalHelper");
const TicketPlugin = require("../../server/api/ticket");

// Mock Datas JSON
const MockTicket = require("../fixtures/database/allTickets.json");
const MockTicketDetail = require("../fixtures/database/ticketDetail.json");
const MockBooking = require("../fixtures/database/allBooking.json");
const MockBookingDetail = require("../fixtures/database/bookingDetail.json");
const MockCoupon = require("../fixtures/database/allcoupon.json");
const MockCouponByTicketId = require("../fixtures/database/allCouponByTicketId.json");

// Config
let apiUrl;
let server;
let query;
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
let mockTicket;

// Spy DB
let getTickets;
let createTickets;
let updateTickets;
let transaction;

// Spy function
let uploadCloudinary;

describe("Ticket Json", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/order-aja", TicketPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("All Ticket", () => {
    beforeEach(() => {
      apiUrl = "/ticket/ticket";

      mockTicket = _.cloneDeep(MockTicket);

      getTickets = jest.spyOn(db.ticket, "findAll");
    });

    test("Should Return 200: Get All Ticket Public", async () => {
      query = {
        ticketName: "test",
      };
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Get All Ticket Public Error Data Not Array", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server).get(apiUrl).expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get All Ticket Public With Unknown Params", async () => {
      query = {
        ticketNameaa: "test",
      };
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Ticket Detail", () => {
    beforeEach(() => {
      query = {
        id: 1,
      };
      apiUrl = "/ticket/ticket/detail";

      mockTicket = { dataValues: _.cloneDeep(MockTicketDetail) };

      getTickets = jest.spyOn(db.ticket, "findOne");
    });

    test("Should Return 200: Get Ticket Detail", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Ticket Detail Not Found", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Ticket Detail Without Required Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(400);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business My All Ticket", () => {
    beforeEach(() => {
      apiUrl = "/ticket/ticket/mytickets";

      mockTicket = _.cloneDeep(MockTicket);

      getTickets = jest.spyOn(db.ticket, "findAll");
    });

    test("Should Return 200: Get All My Ticket", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get All My Ticket Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server).get(apiUrl).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get All My Ticket Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Ticket Detail", () => {
    beforeEach(() => {
      query = {
        id: 1,
      };
      apiUrl = "/ticket/ticket/mytickets/detail";

      mockTicket = { dataValues: _.cloneDeep(MockTicketDetail) };

      getTickets = jest.spyOn(db.ticket, "findOne");
    });

    test("Should Return 200: Get My Ticket Detail", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: My Ticket Detail Not Found", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: My Ticket Detail Without Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: My Ticket Detail With Different User Access", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusinessOther)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: My Ticket Detail Without User Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get My Ticket Detail With Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Customer All Booking Data", () => {
    beforeEach(() => {
      apiUrl = "/ticket/booking";

      mockTicket = _.cloneDeep(MockBooking);

      getTickets = jest.spyOn(db.booking, "findAll");
    });

    test("Should Return 200: Get Customer All Booking", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Get Customer All Booking Wrong Data Format", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Customer All Booking Without User Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server).get(apiUrl).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer All Booking With Business Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Customer Booking Detail", () => {
    beforeEach(() => {
      query = {
        id: 1,
      };
      apiUrl = "/ticket/booking/detail";

      mockTicket = _.cloneDeep(MockBookingDetail);

      getTickets = jest.spyOn(db.booking, "findOne");
    });

    test("Should Return 200: Get Customer Booking Detail", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Get Customer Booking Detail Not Found", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get Customer Booking Detail Without Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer Booking Detail Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer Booking Detail Using Business Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business All Booking Data", () => {
    beforeEach(() => {
      apiUrl = "/ticket/booking/business";

      mockTicket = _.cloneDeep(MockBooking);

      getTickets = jest.spyOn(db.booking, "findAll");
    });

    test("Should Return 200: Get Business All Booking", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business All Booking Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server).get(apiUrl).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business All Booking Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Booking Detail", () => {
    beforeEach(() => {
      query = {
        id: 1,
      };
      apiUrl = "/ticket/booking/business/detail";

      mockTicket = _.cloneDeep(MockBookingDetail);

      getTickets = jest.spyOn(db.booking, "findOne");
    });

    test("Should Return 200: Get Business Booking Detail", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Get Business Booking Detail Not Found", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get Business Booking Detail Without Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business Booking Detail Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business Booking Detail Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business All Coupon Data", () => {
    beforeEach(() => {
      apiUrl = "/ticket/coupon";

      mockTicket = _.cloneDeep(MockCoupon).map((data) => ({
        dataValues: data,
      }));

      getTickets = jest.spyOn(db.coupon, "findAll");
    });

    test("Should Return 200: Get Business All Coupon", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Get Business All Coupon DB Error", async () => {
      getTickets.mockImplementation(() => {
        throw new Error("DB Error");
      });

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business All Coupon Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server).get(apiUrl).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Business All Coupon Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Customer All Coupon Data By Ticket Id", () => {
    beforeEach(() => {
      apiUrl = "/ticket/coupon/byticket";
      query = {
        id: 1,
      };

      mockTicket = _.cloneDeep(MockCouponByTicketId);

      getTickets = jest.spyOn(db.ticket, "findOne");
    });

    test("Should Return 200: Get Customer All Coupon By Ticket Id", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 200: Get Customer All Coupon By Ticket Id But Empty coupons", async () => {
      getTickets.mockResolvedValue({});

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Get Customer All Coupon By Ticket Id Without Params", async () => {
      query = {};

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer All Coupon By Ticket Id Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Get Customer All Coupon By Ticket Id Using Business Account", async () => {
      getTickets.mockResolvedValue(mockTicket);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Get Customer All Coupon By Ticket Invalid DB Data Format", async () => {
      getTickets.mockResolvedValue({ coupons: {} });

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(500);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Customer Create Booking", () => {
    beforeEach(() => {
      apiUrl = "/ticket/booking/create";
      body = {
        data: "U2FsdGVkX1/5ojfIeq1VN6zL1ChOXw7/MkfsMabvayI/LncfJIjIGZWrDQe68tk2wyEwXemEYE7XNJyFF/hfb82gI6nGfdASOEJj/vtg5CuJqNvhJP3pkcZL5VplNg+CTYfpzTP52/3G74DVHgIuF3+zs1bVHo/ByicG2J16ENVIMNW87pY/z8FY+FDmAFJ9+7s2spHaVPtq0lHP7ODi4A==",
      };

      mockTicket = { dataValues: _.cloneDeep(MockTicketDetail) };

      // jest.mock('../../models', () => ({
      //   sequelize: {
      //     transaction: jest.fn()
      //   },
      //   ticket: {
      //     findOne: jest.fn()
      //   },
      //   booking: {
      //     create: jest.fn()
      //   },
      //   couponConnector: {
      //     create: jest.fn()
      //   }
      // }));

      getTickets = jest.spyOn(db.ticket, "findOne");
      transaction = jest.spyOn(db.sequelize, "transaction");
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    test("Should Return 200: Create Customer Booking Data", async () => {
      getTickets.mockResolvedValue(mockTicket);
      const coupons = [1, 2, 3];

      transaction.mockImplementation(async (callback) => {
        const createBookingSpy = jest.spyOn(db.booking, "create");
        const createdBooking = { id: 123 };
        createBookingSpy.mockResolvedValue(createdBooking);

        // eslint-disable-next-line no-restricted-syntax
        for (const couponId of coupons) {
          const createConnectorSpy = jest.spyOn(db.couponConnector, "create");
          createConnectorSpy.mockResolvedValue({ id: couponId });
        }

        await callback();

        return createdBooking.id;
      });

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Create Customer Booking Data With Nonexisted Ticket", async () => {
      getTickets.mockResolvedValue({});
      transaction.mockResolvedValue(1);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Customer Booking Data Booking Data Creation Failed", async () => {
      getTickets.mockResolvedValue(mockTicket);

      transaction.mockImplementation(async (callback) => {
        const createBookingSpy = jest.spyOn(db.booking, "create");
        const createdBooking = { id: 123 };
        createBookingSpy.mockResolvedValue(null);

        await callback();

        return createdBooking.id;
      });

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Customer Booking Data Error Creating Data", async () => {
      getTickets.mockResolvedValue(mockTicket);
      transaction.mockImplementation(() => {
        throw new Error("DB Creation Failed!");
      });

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Customer Booking Data Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);
      transaction.mockResolvedValue(1);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Customer Booking Data Using Business Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      transaction.mockResolvedValue(1);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Customer Booking Data Without Params", async () => {
      getTickets.mockResolvedValue(mockTicket);
      transaction.mockResolvedValue(1);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Customer Booking Data With Unknown Encrypt Data", async () => {
      body = {
        data: "adwadwaaw",
      };

      getTickets.mockResolvedValue(mockTicket);
      transaction.mockResolvedValue(1);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Customer Booking Data With Invalid Encrypted Form Data", async () => {
      body = {
        data: "U2FsdGVkX18XxO22J2Qcfi67Rb63jV8JgN54MhLycdWRGQqZ6b3wYZinY4EJq2cCPV3w9ou0/VvgHveGiFeBS71eTkzGPp5i8kGhoBw5C0ATVPuAZ/uZ/BV5JIrEn6iPekM+9Z8q+5StfgAkw3CFpNBV0Ry89A8QAQ2tcinqEH3b6ilsPDdT9uGMyBGrccGgi2dXji4CnhsK+YoEK9g/0zsz03YfPvcLs2ec+8qxWBMhBIZXvvuDi4r0UPlAFk5+WFxJaUPOddhuG/BGaPsDVSnWUf04FfRmt4pYuH6Ycw0=",
      };

      getTickets.mockResolvedValue(mockTicket);
      transaction.mockResolvedValue(1);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(400);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Create Coupon", () => {
    beforeEach(() => {
      apiUrl = "/ticket/coupon/create";
      body = {
        name: "Test kupon",
        priceCut: 10000,
      };

      createTickets = jest.spyOn(db.coupon, "create");
    });

    test("Should Return 200: Create Business Coupon Data", async () => {
      createTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Business Coupon Data Without Params", async () => {
      createTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Business Coupon Data Without Login", async () => {
      createTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .post(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Business Coupon Data Using Customer Account", async () => {
      createTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Business Coupon Data Create Failed", async () => {
      createTickets.mockResolvedValue(null);

      const res = await Request(server)
        .post(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(500);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Create Ticket", () => {
    beforeEach(() => {
      apiUrl = "/ticket/ticket/create";
      body = {
        title: "Test Create",
        location: "Test Location",
        description: "test desc",
        variants:
          '[{"variantName":"test variant 1","price":"10000"},{"variantName":"test variant 2","price":"100000"}]',
      };

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
      createTickets = jest.spyOn(db.ticket, "create");
    });

    test("Should Return 200: Create Business Ticket Data", async () => {
      createTickets.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Business Ticket Data Using Invalid JSON Variant", async () => {
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      body = {
        ...body,
        variants: "awdadwa",
      };

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Business Ticket Data Without Params", async () => {
      createTickets.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Create Business Ticket Data Without Image", async () => {
      createTickets.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Business Ticket Data Without Login", async () => {
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      const res = await Request(server).put(`${apiUrl}`).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Create Business Ticket Data Using Customer Account", async () => {
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Business Ticket Data Create Failed", async () => {
      createTickets.mockResolvedValue(null);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(500);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Create Business Ticket Data Upload Failed", async () => {
      createTickets.mockResolvedValue("SUCCESS");
      uploadCloudinary.mockResolvedValue(null);

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .put(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(500);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Edit Ticket", () => {
    beforeEach(() => {
      apiUrl = "/ticket/ticket/edit";
      body = {
        id: 1,
        title: "Test Create",
        location: "Test Location",
        description: "test desc",
        variants:
          '[{"variantName":"test variant 1","price":"10000"},{"variantName":"test variant 2","price":"100000"}]',
      };

      mockTicket = {
        dataValues: _.cloneDeep(MockTicketDetail),
        update: jest.fn(),
      };
      getTickets = jest.spyOn(db.ticket, "findOne");
      updateTickets = jest.spyOn(mockTicket, "update");
      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    });

    test("Should Return 200: Edit Business Ticket Data", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 200: Edit Business Ticket Data Without Image", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Edit Business Ticket Data Not Found", async () => {
      getTickets.mockResolvedValue({});
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Edit Business Ticket Data Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server).patch(`${apiUrl}`).expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Edit Business Ticket Data Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Edit Business Ticket Data Using Other Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Edit Business Ticket Data Without Params", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Edit Business Ticket Data Using Invalid JSON Varinats", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue({ url: "this is url" });
      updateTickets.mockResolvedValue("SUCCESS");

      body = {
        ...body,
        variants: "adwadw",
      };

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 500: Edit Business Ticket Data Upload Image Failed", async () => {
      getTickets.mockResolvedValue(mockTicket);
      uploadCloudinary.mockResolvedValue(null);
      updateTickets.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/en.png";

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .field("id", body?.id)
        .field("title", body?.title)
        .field("location", body?.location)
        .field("description", body?.description)
        .field("variants", body?.variants)
        .attach("imageData", filePath)
        .expect(500);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Update Booking Status", () => {
    beforeEach(() => {
      apiUrl = "/ticket/booking/status/update";
      body = {
        id: 1,
        isSuccess: true,
      };

      getTickets = jest.spyOn(db.booking, "findOne");
      mockTicket = { ..._.cloneDeep(MockBookingDetail), update: jest.fn() };
      updateTickets = jest.spyOn(mockTicket, "update");
    });

    test("Should Return 200: Business Update Booking Status Data", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 200: Business Update Booking Status Data With isSuccess = false", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      body.isSuccess = false;

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Business Update Booking Status Data Without Params", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Business Update Booking Status Data Not Found", async () => {
      getTickets.mockResolvedValue({});
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Update Booking Status Data Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Update Booking Status Data With Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Update Booking Status Data With Other Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .patch(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Delete Ticket", () => {
    beforeEach(() => {
      apiUrl = "/ticket/ticket/delete";
      body = {
        id: 1,
      };

      getTickets = jest.spyOn(db.ticket, "findOne");
      mockTicket = {
        dataValues: _.cloneDeep(MockTicketDetail),
        update: jest.fn(),
      };
      updateTickets = jest.spyOn(mockTicket, "update");
    });

    test("Should Return 200: Business Delete Ticket Data", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Business Delete Ticket Data Not Found", async () => {
      getTickets.mockResolvedValue({});
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Business Delete Ticket Data Without Params", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Ticket Data Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Ticket Data Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Ticket Data Using Other Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Business Delete Coupon", () => {
    beforeEach(() => {
      apiUrl = "/ticket/coupon/delete";
      body = {
        id: 1,
      };

      getTickets = jest.spyOn(db.coupon, "findOne");
      mockTicket = {
        dataValues: _.cloneDeep(MockTicketDetail),
        update: jest.fn(),
      };
      updateTickets = jest.spyOn(mockTicket, "update");
    });

    test("Should Return 200: Business Delete Coupon Data", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(200);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 400: Business Delete Coupon Data Without Params", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(400);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 404: Business Delete Coupon Data Not Found", async () => {
      getTickets.mockResolvedValue({});
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusiness)
        .send(body)
        .expect(404);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Coupon Data Without Login", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Coupon Data Using Customer Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenCustomer)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });

    test("Should Return 401: Business Delete Coupon Data Using Other Account", async () => {
      getTickets.mockResolvedValue(mockTicket);
      updateTickets.mockResolvedValue("SUCCESS");

      const res = await Request(server)
        .delete(`${apiUrl}`)
        .set("Authorization", bearerTokenBusinessOther)
        .send(body)
        .expect(401);

      expect(res.body).toBeTruthy();
    });
  });
});
