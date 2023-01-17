const { MongoClient } = require('mongodb');
const mockSES = require('aws-sdk/clients/ses');
const { execute } = require('../commands/iam');

jest.mock('aws-sdk/clients/ses', () => {
    const mSES = {
        sendEmail: jest.fn().mockReturnThis().mockName('sendEmail'),
        promise: jest.fn().mockName('promise'),
    };
    return jest.fn(() => mSES);
});

describe('iam', () => {
    let interaction;
    beforeAll(() => {
        interaction = {
            options: {
                get: jest.fn().mockImplementation((name) => {
                    return {
                        value: interaction.options[name]
                    }
                }),
            },
            member: {
                user: {
                    id: 0,
                }
            },
            reply: jest.fn()
        }
    })
    describe('given invalid email', () => {
        test('sends error message', async () => {
            interaction.options.email = 'not an email';
            await execute(interaction);
            expect(interaction.reply).toHaveBeenCalledWith({
                content: 'Your email doesn\'t appear to be a valid email. Please try again',
                ephemeral: true,
            });
        })
    });
    describe('with valid email', () => {
        test('sends email', async () => {
            const mSES = new mockSES();
            interaction.options.email = 'chris.m.milan@gmail.com';
            await execute(interaction);
            expect(interaction.reply).toHaveBeenCalledWith({
                content: 'Please check your email address for an authorization code',
                ephemeral: true
            });
            expect(mSES.sendEmail).toHaveBeenCalled();
        });
        test('stores verification code', async () => {
            interaction.options.email = 'chris.m.milan@gmail.com';
            const client = new MongoClient(global.__MONGO_URI__);
            const db = client.db('datares-discord-bot');

            await execute(interaction);

            expect(interaction.reply).toHaveBeenCalledWith({
                content: 'Please check your email address for an authorization code',
                ephemeral: true
            });
            expect(await db.collection('verification').findOne({user_id: 0})).toEqual(expect.objectContaining({
                email: 'chris.m.milan@gmail.com',
                user_id: 0
            }));
            await client.close();
        });
    })
})