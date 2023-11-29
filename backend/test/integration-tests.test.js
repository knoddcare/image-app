const mongoose = require("mongoose");
const supertest = require("supertest");
const moment = require("moment");
const app = require("../app");
const dropAllCollections = require("./utils/dropAllCollections");
const removeAllFiles = require("./utils/removeAllFiles");

const request = supertest(app);

// Connects to test database
beforeAll(async () => {
  process.env.ENV = "test";

  const url = `mongodb://127.0.0.1/image-app-test-db`;

  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up test output, database and drop connection
afterAll(async () => {
  await dropAllCollections();
  removeAllFiles();

  await mongoose.connection.close();
});

test("Return 404 for invalid endpoint", async () => {
  const response = await request.get("/invalid");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Cannot find /invalid on this server!`);
});


test("POST /images - upload image", async () => {
  const testImageName = "Test";
  const expectedFilePathPattern = /\/img\/Test_\d+.jpeg/;

  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.jpeg");

  expect(response.status).toBe(201);
  expect(response.body.data.name).toBe(testImageName);
  expect(expectedFilePathPattern.test(response.body.data.path)).toBe(true);
});

test("GET /images - returns array of metadata for uploaded images", async () => {
  const testImageName = "Test";
  const expectedFilePathPattern = /\/img\/Test_\d+.jpeg/;

  const response = await request.get("/images");

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].name).toBe(testImageName);
  expect(expectedFilePathPattern.test(response.body.data[0].path)).toBe(true);
});

test("Post /images - should only allow valid extensins", async () => {
  const testImageName = "Test";

  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.invalidExt");

  expect(response.ok).toBe(false);
  expect(response.status).toBe(400);
});

test("Post /images - should transform name", async () => {
  const testImageName = "min blå cykel";
  const expectedFilePathPattern = /\/img\/min-bl-cyk_(?<dateGroup>\d+).jpeg/;

  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.jpeg");
 
  expect(response.status).toBe(201);
  expect(response.body.data.name).toBe(testImageName);
  expect(expectedFilePathPattern.test(response.body.data.path)).toBe(true);

  const groups = expectedFilePathPattern.exec(response.body.data.path).groups;
  expect(groups).not.toBeNull();

  const dateGroup = groups['dateGroup'];
  expect(dateGroup).not.toBeNull();
  expect(dateGroup.startsWith(moment().format("YYYYMMDDHHmm"))).toBe(true);
});
