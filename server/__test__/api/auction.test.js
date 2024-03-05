const Request = require("supertest");
const QS = require("qs");
const _ = require("lodash");

const db = require("../../models");
const GeneralHelper = require("../../server/helpers/generalHelper");
const Auction = require("../../server/api/auctions");
const cloudinary = require("../../server/services/cloudinary.js");
const redis = require("../../server/services/redis");

// Mock Datas JSON
const MockItemData = require("../fixtures/database/allItemsData.json");
const MockAuctionLatest = require("../fixtures/database/latestAuction.json");
const MockAuctionDetail = require("../fixtures/database/detailData.json");
const MockMyAuctionDetail = require("../fixtures/database/myAuction.json");

// Config
let apiUrl;
let server;
let query;
let body;
const bearerTokenCustomer =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJidXllciIsImlhdCI6MTcwOTQ2MjgxOSwiZXhwIjoxNzQwOTk4ODE5fQ.LMEcxEhUwivhjPK9goOkf51N8grG3cExRM56Q6rq-tI";
// let bearerTokenCustomerOther =
//   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcwNzYyNjk5MCwiZXhwIjoxNzM5MTYyOTkwfQ.lc6GiqO42jK42GnwWkLRj3yR0JS_wZSzKq0f3GZ78v0";

const bearerTokenBusiness =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MDk0NjQzMTQsImV4cCI6MTc0MTAwMDMxNH0.aQv02LYpNra-Kjar78gq6fdCNyJBQ-kzGBoKhRjLCp0";
const bearerTokenBusinessOther =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzk4NDExMiwiZXhwIjoxNzM5NTIwMTEyfQ.-VplM5SXVhdkBaWIWrT6vVAPDwojWkGJlrNqt4xlvS8";

// Databases
let mockData;

// Spy DB
let getData;
let createData;
let updateData;

// Spy Functins
let redisSetFunction;
let redisGetFunction;
let cloudinaryFunction;

describe("Auction APIs", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/auction", Auction);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("All auction data", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions";

      mockData = _.cloneDeep(MockItemData);

      getData = jest.spyOn(db.item, "findAll");
    });

    test("Should Return 200: Get All Auction", async () => {
      getData.mockResolvedValue(mockData);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenCustomer)
        .expect(200);

      expect(res.body).toBeTruthy();
    });
  });

  describe("All My auction data", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions/my-auctions";

      mockData = _.cloneDeep(MockItemData);

      getData = jest.spyOn(db.item, "findAll");
    });

    test("Should Return 200: Get All My Auction", async () => {
      getData.mockResolvedValue(mockData);

      const res = await Request(server)
        .get(apiUrl)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Get Latest Auction", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions/latest";

      mockData = _.cloneDeep(MockAuctionLatest);

      getData = jest.spyOn(db.item, "findAll");

      redisGetFunction = jest.spyOn(redis, "getKeyJSONValue");
      redisSetFunction = jest.spyOn(redis, "setKeyJSONValue");
    });

    test("Should Return 200: Get Latest Auction", async () => {
      getData.mockResolvedValue(mockData);
      redisGetFunction.mockResolvedValue(null);

      const res = await Request(server).get(apiUrl).expect(200);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Get Five Min Auction", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions/fivemin";

      mockData = _.cloneDeep(MockAuctionLatest);

      getData = jest.spyOn(db.item, "findAll");
    });

    test("Should Return 200: Get Five Min Auction", async () => {
      getData.mockResolvedValue(mockData);

      const res = await Request(server).get(apiUrl).expect(200);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Get Categories Data", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions/categories";

      mockData = _.cloneDeep(MockAuctionLatest);

      getData = jest.spyOn(db.category, "findAll");

      redisGetFunction = jest.spyOn(redis, "getKeyJSONValue");
      redisSetFunction = jest.spyOn(redis, "setKeyJSONValue");
    });

    test("Should Return 200: Get Category Auction", async () => {
      getData.mockResolvedValue(mockData);
      redisGetFunction.mockResolvedValue(null);

      const res = await Request(server).get(apiUrl).expect(200);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Get Auction Detail", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions/detail";

      mockData = _.cloneDeep(MockAuctionDetail);

      getData = jest.spyOn(db.item, "findOne");

      query = {
        id: 1,
      };

      redisGetFunction = jest.spyOn(redis, "getKeyJSONValue");
      redisSetFunction = jest.spyOn(redis, "setKeyJSONValue");
    });

    test("Should Return 200: Get Detail Auction", async () => {
      getData.mockResolvedValue(mockData);
      redisGetFunction.mockResolvedValue(null);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(200);

      expect(res.body).toBeTruthy();
    });
  });

  describe("Get My Auction Detail", () => {
    beforeEach(() => {
      apiUrl = "/auction/auctions/my-auctions/detail";

      mockData = _.cloneDeep(MockMyAuctionDetail);

      getData = jest.spyOn(db.item, "findOne");

      query = {
        id: 1,
      };

      redisGetFunction = jest.spyOn(redis, "getKeyJSONValue");
      redisSetFunction = jest.spyOn(redis, "setKeyJSONValue");
    });

    test("Should Return 200: Get Detail Auction", async () => {
      getData.mockResolvedValue(mockData);
      redisGetFunction.mockResolvedValue(null);

      const res = await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set("Authorization", bearerTokenBusiness)
        .expect(200);

      expect(res.body).toBeTruthy();
    });
  });
});
