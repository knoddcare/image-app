const fs = require("fs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const dropAllCollections = require("./utils/dropAllCollections");

const request = supertest(app);

const testImageName = "Awesome photo";
const expectedFilePattern = /^\/img\/Awesome-ph_\d+\.(jpeg|jpg|png)$/

// Connects to test database
beforeAll(async () => {
  process.env.ENV = "test";
  const url = `mongodb://127.0.0.1/image-app-test-db`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up test database and drop connection
afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
});

test("Return 404 for invalid endpoint", async () => {
  const response = await request.get("/invalid");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Cannot find /invalid on this server!`);
});

test("POST /images - upload image", async () => {
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.jpeg");

  const filePath = `public/${response.body.data.data.path}`;

  const fileExists = fs.existsSync(filePath);

  // Clean up by removing file again
  if (fileExists) {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  }

  expect(response.status).toBe(201);
  expect(response.body.data.data.name).toBe(testImageName);
  expect(response.body.data.data.path).toMatch(expectedFilePattern);
  expect(fileExists).toBe(true);
});

test("GET /images - returns array of metadata for uploaded images", async () => {
  const response = await request.get("/images");

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].name).toBe(testImageName);
  expect(response.body.data[0].path).toMatch(expectedFilePattern);
});

test("POST /images - upload file with unsupported format", async () => {
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.gif");

  expect(response.status).toBe(415);
});
