const { MongoClient } = require('mongodb');
const mockSES = require("aws-sdk/clients/ses");
const iam = require("../commands/iam");

jest.mock("aws-sdk/clients/ses", () => {
    const mSES = {
        sendEmail: jest.fn().mockReturnThis().mockName("sendEmail"),
        promise: jest.fn().mockName("promise"),
    };
    return jest.fn(() => mSES);
});

describe("iam", () => {
    describe("given invalid email", () => {
        test("returns 'invalid email'", async () => {
            expect(await iam("not an email", 0)).toBe("invalid email");
            expect(await iam("jbruin", 0)).toBe("invalid email");
        })
    });
    describe("with valid email", () => {
        let client;
        let db;
        beforeAll(() => {
            client = new MongoClient(global.__MONGO_URI__);
            db = client.db("datares-discord-bot");
        });
        afterAll(async () => {
            await client.close();
        });
        test("sends email", async () => {
            const mSES = new mockSES();
            expect(await iam("chris.m.milan@gmail.com", 0)).toBe("success");
            expect(mSES.sendEmail).toHaveBeenCalled();
        });
        test("stores verification code", async () => {
            let email = "chris.m.milan@gmail.com";
            let user_id = 0;

            expect(await iam(email, user_id)).toBe("success");
            
            expect(await db.collection("verification").findOne({user_id})).toEqual(expect.objectContaining({
                email,
                user_id
            }));
        });
    })
})