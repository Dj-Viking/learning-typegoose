import request from "supertest";
import mongoose from "mongoose";
import Card from "../models/Card";
import { ICreateCardPayload } from "../types";
import createServer from "../app";
import { LOCAL_DB_URL } from "../constants";

beforeEach((done) => {
  mongoose.connect(LOCAL_DB_URL, {}, () => done());
});

afterEach((done) => {
  // mongoose.connection.db.dropDatabase(() => {
  //   mongoose.connection.close(() => done());
  // });
  mongoose.connection.close(() => done());
});
const app = createServer();
let newCardId: string | null = null;

describe("card CRUD stuff", () => {
  //create card
  test("POST /card create a new card", async () => {
    const createCardRes = await request(app)
      .post("/card")
      .send({
        frontsideText: "привет",
        frontsideLanguage: "Русский",
        frontsidePicture: "kdfjdjkfd",
        backsideText: "hello",
        backsideLanguage: "English",
        backsidePicture: "ksdjfdkj",
      } as ICreateCardPayload);
    console.log(
      "\x1b[33m",
      "create response \n",
      JSON.stringify(createCardRes, null, 2),
      "\x1b[00m"
    );
    expect(createCardRes.statusCode).toBe(201);
    expect(typeof JSON.parse(createCardRes.text).card._id).toBe("string");
    expect(JSON.parse(createCardRes.text).card.frontsideText).toBe("привет");
    newCardId = JSON.parse(createCardRes.text).card._id;
  });
  // checks edit card with bogus id will give correct error response
  test("PUT /card/:id update card with bogus id", async () => {
    console.log("previous id", newCardId);
    const bogusId = newCardId?.replace(newCardId[1], "f");
    console.log("bogus id", bogusId);
    const notFound = await request(app).put(`/card/${bogusId}`);
    expect(notFound.statusCode).toBe(404);
    expect(JSON.parse(notFound.text).message).toBe("card not found");
  });
  //edit card
  test("PUT /card/:id update a card by it's id", async () => {
    const updateCardRes = await request(app).put(`/card/${newCardId}`).send({
      frontsideText: "updated front side text",
    });
    console.log(
      "\x1b[33m",
      "update response \n",
      JSON.stringify(updateCardRes, null, 2),
      "\x1b[00m"
    );
    expect(updateCardRes.statusCode).toBe(200);
    expect(JSON.parse(updateCardRes.text).card.frontsideText).toBe(
      "updated front side text"
    );
  });
  //delete card
  test("delete the card we just made", async () => {
    await Card.findOneAndDelete({ _id: newCardId });
  });
});