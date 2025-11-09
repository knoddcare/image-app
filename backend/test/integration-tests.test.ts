import fs from "fs";
import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it, test, vi } from "vitest";
import { app } from "../app.js";
import { dropAllCollections } from "./utils/dropAllCollections.js";
import { generateName } from "../controllers/imageController.js";
import { ERROR_MESSAGES } from "../errors/AppError.js";

const request = supertest(app);

const testImageName = "En blå cykel";
const expectedFilePath = (name: string) => `/img/${generateName(name)}.jpeg`;

beforeAll(async () => {
  process.env.ENV = "test";
  const url = "mongodb://127.0.0.1/image-app-test-db";
  await mongoose.connect(url);
  vi.spyOn(Date, "now").mockReturnValue(1762681944);

});

afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();
  vi.restoreAllMocks();
});

test("Return 404 for invalid endpoint", async () => {
  const response = await request.get("/invalid");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Can't find /invalid on this server!`);
});

describe('generateFilename', () => {
  it('returns a filename truncated to 10 characters and suffixed with a timestamp (e.g., test-aao-n_1762681944)', () => {
    const name = "Test ÅÄÖ Name";
    const generatedName = generateName(name);
    expect(generatedName).toBe("test-aao-n_1762681944");
  });
});

test("POST /images - upload image", async () => {
  
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.jpeg");

  const generatedName = generateName(testImageName);
  const expectedPath = expectedFilePath(testImageName);

  const fileExists = fs.existsSync(`public${expectedPath}`);

  if (fileExists) {
    fs.unlink(`public${expectedPath}`, (err) => {
      if (err) throw err;
    });
  }

  expect(response.status).toBe(201);
  expect(response.body.data.data.name).toBe(`${generatedName}.jpeg`);
  expect(response.body.data.data.path).toBe(expectedPath);
  expect(fileExists).toBe(true);
});

test("POST /images - upload with missing file should return 400 with message 'Missing file'", async () => {
  const response = await request
    .post("/images")
    .field("name", testImageName)

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(ERROR_MESSAGES.MISSING_FILE);

});

test("POST /images - upload with invalid file should return 400 with message 'Invalid file type'", async () => {
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.txt");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);

});

test("POST /images - upload with missing name should return 400 with message 'Missing name'", async () => {
  const response = await request
    .post("/images")
    .attach("photo", "test/utils/test.jpeg");

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(ERROR_MESSAGES.MISSING_NAME);
});

test("GET /images - returns array of metadata for uploaded images", async () => {
  const response = await request.get("/images");

  const generatedName = generateName(testImageName);

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].name).toBe(`${generatedName}.jpeg`);
  expect(response.body.data[0].path).toBe(expectedFilePath(testImageName));
});