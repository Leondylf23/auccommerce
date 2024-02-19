const Request = require('supertest');
const _ = require('lodash');

const db = require('../../models');
const cloudinary = require('../../server/services/cloudinary');
const GeneralHelper = require('../../server/helpers/generalHelper');
const AuthPlugin = require('../../server/api/authUser');
const MockUser = require('../fixtures/database/userData.json');

// Config
let apiUrl;
let server;
let body;
let bearerToken;

// Databases
let mockUser;

// Spy DB
let getUser;
let createUser;
let updateUser;

// Spy function
let uploadCloudinary;

describe('User Json', () => {
    beforeAll(() => {
        server = GeneralHelper.createTestServer('/auth', AuthPlugin);
    });

    afterAll(async () => {
        await server.close();
    });

    describe('Register User', () => {
        beforeEach(() => {
            apiUrl = '/auth/register';
            body = {
                fullname: 'U2FsdGVkX19UD49az3JuF0VXEfVZIDf7KsGC8qJpL5E=',
                dob: 'U2FsdGVkX1/SbPX2a0aox2Rjz7+4Ka2zXJbeqDIDVpo=',
                email: 'U2FsdGVkX1/9idHRiXddxKPYQqaDZAVRL3un9enxlNo=',
                password: 'U2FsdGVkX18U26W+1wY+pWFvb97N7s9ts9xnU67aSvg=',
                role: 'U2FsdGVkX18KKP0JAwckeOLHzDkeLatH+bwwpey73q4='
            };

            mockUser = { dataValues: _.cloneDeep(MockUser) };

            getUser = jest.spyOn(db.user, 'findOne');
            createUser = jest.spyOn(db.user, 'create');
        });

        test('Should Return 200: Create New User', async () => {
            getUser.mockResolvedValue({});
            createUser.mockResolvedValue('SUCCESS');

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeTruthy();
                });
        });

        test('Should Return 422: Create New User With Exisiting Email', async () => {
            getUser.mockResolvedValue(mockUser);
            createUser.mockResolvedValue('SUCCESS');

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(422)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 400: Body Not Matched', async () => {
            body = { ...body, email: undefined };

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).toBeTruthy();
                });
        });

        test('Should Return 500: Failed to Create User', async () => {
            getUser.mockResolvedValue({});
            createUser.mockResolvedValue(null);

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(500)
                .then(res => {
                    expect(res.body).toBeTruthy();
                });
        });
    });

    describe('Login User', () => {
        beforeEach(() => {
            apiUrl = '/auth/login';
            body = {
                email: 'U2FsdGVkX1+Kbv4eat40YMi1D8hWR92Of4bawIxapOQ=',
                password: 'U2FsdGVkX18swOXDrfnCZBcMZZZRTzNZHnhX1/ZlvLc='
            };

            mockUser = { dataValues: _.cloneDeep(MockUser) };

            getUser = jest.spyOn(db.user, 'findOne');
        });

        test('Should Return 200: Login User', async () => {
            getUser.mockResolvedValue(mockUser);

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeTruthy();
                    expect(res.body?.data?.token).toBeTruthy();
                    expect(res.body?.data?.userData).toBeTruthy();
                })
        });

        test('Should Return 401: Login with nonexisted email', async () => {
            getUser.mockResolvedValue({});

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 401: Login with wrong password', async () => {
            body = {
                ...body,
                password: 'U2FsdGVkX1+Kbv4eat40YMi1D8hWR92Of4bawIxapOQ='
            }
            getUser.mockResolvedValue(mockUser);

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 400: Body Not Matched', async () => {
            body = { ...body, email: undefined };

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });
    });

    describe('User Profile', () => {
        beforeEach(() => {
            apiUrl = '/auth/profile';
            body = {};

            // Token with no exp
            bearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5MTY3MiwiZXhwIjoxNzM5MTI3NjcyfQ.FbIykiO6Jx5zDW60BE26JnbxwXsDc3q-slDtvvFVcyM';

            mockUser = { dataValues: _.cloneDeep(MockUser) };

            getUser = jest.spyOn(db.user, 'findOne');
        });

        test('Should Return 200: Get User Profile Data', async () => {
            getUser.mockResolvedValue(mockUser);

            await Request(server)
                .get(apiUrl)
                .set('Authorization', bearerToken)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeTruthy();
                    expect(res.body?.data).toBeTruthy();
                })
        });

        test('Should Return 422: User data not found', async () => {
            getUser.mockResolvedValue({});

            await Request(server)
                .get(apiUrl)
                .set('Authorization', bearerToken)
                .expect(422)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 401: Using Invalid Token', async () => {
            getUser.mockResolvedValue({});

            bearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDc1ODk1NTQsImV4cCI6MTcwNzYzMjc1NH0.3MH8VzMkEfnCUaECx-A1ITAKT7C-k_GbogfV7A_Ar5g'

            await Request(server)
                .get(apiUrl)
                .set('Authorization', bearerToken)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 401: User not logined', async () => {

            await Request(server)
                .get(apiUrl)
                .send(body)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });
    });

    describe('Change Password', () => {
        beforeEach(() => {
            apiUrl = '/auth/changepassword';
            body = {
                oldPassword: 'U2FsdGVkX1/EEJD9Via90Dyb5dmRSwbOcXO/p002Kn8=',
                newPassword: 'U2FsdGVkX18BnxMAGMfT6dwpYJ9Td7vOLTVGRjAueYE='
            };

            // Token with no exp
            bearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5MTY3MiwiZXhwIjoxNzM5MTI3NjcyfQ.FbIykiO6Jx5zDW60BE26JnbxwXsDc3q-slDtvvFVcyM';

            mockUser = { dataValues: _.cloneDeep(MockUser), update: jest.fn() };

            getUser = jest.spyOn(db.user, 'findOne');
            updateUser = jest.spyOn(mockUser, 'update');
        });

        test('Should Return 200: Successfully Change Password', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue({ ...mockUser, password: 'updated' });

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 500: Password Not Updated', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue({});

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(500)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 422: Profile data not found', async () => {
            getUser.mockResolvedValue({});

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(422)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 401: Wrong old password', async () => {
            body = {
                ...body,
                oldPassword: 'U2FsdGVkX1+0aSxGRuqp4We1lSnvoqLckdMd3a106N4='
            }

            getUser.mockResolvedValue(mockUser);

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 401: User not logined', async () => {

            await Request(server)
                .patch(apiUrl)
                .send(body)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 400: Bad Request Data', async () => {
            body = {
                oldPassword: 'U2FsdGVkX1+0aSxGRuqp4We1lSnvoqLckdMd3a106N4='
            }

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });
    });

    describe('Update User Profile Data', () => {
        beforeEach(() => {
            apiUrl = '/auth/profile/update';
            body = {
                fullname: 'test edit name',
                dob: '2012-01-01'
            };

            // Token with no exp
            bearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXNpbmVzcyIsImlhdCI6MTcwNzU5MTY3MiwiZXhwIjoxNzM5MTI3NjcyfQ.FbIykiO6Jx5zDW60BE26JnbxwXsDc3q-slDtvvFVcyM';

            mockUser = { dataValues: _.cloneDeep(MockUser), update: jest.fn() };

            uploadCloudinary = jest.spyOn(cloudinary, 'uploadToCloudinary');
            getUser = jest.spyOn(db.user, 'findOne');
            updateUser = jest.spyOn(mockUser, 'update');
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        test('Should Return 200: Successfully Change Profile Data', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue(mockUser);

            uploadCloudinary.mockResolvedValue({ url: 'this is url' });

            const filePath = './__test__/fixtures/file/en.png';

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .field('fullname', body?.fullname)
                .field('dob', body?.dob)
                .attach('imageData', filePath)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 500: Profile not updated', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue({});

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .field('fullname', body?.fullname)
                .field('dob', body?.dob)
                .expect(500)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 500: Change Profile Data Image Not Uploaded', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue(mockUser);

            uploadCloudinary.mockResolvedValue(null);

            const filePath = './__test__/fixtures/file/en.png';

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .field('fullname', body?.fullname)
                .field('dob', body?.dob)
                .attach('imageData', filePath)
                .expect(500)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 422: Unknown Profile Data', async () => {
            getUser.mockResolvedValue({});

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(422)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 401: User not logined', async () => {

            await Request(server)
                .patch(apiUrl)
                .send(body)
                .expect(401)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 400: Bad Request Data', async () => {
            body = {
                fullname: 'test name'
            }

            await Request(server)
                .patch(apiUrl)
                .set('Authorization', bearerToken)
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });
    });

    describe('Reset User Password', () => {
        beforeEach(() => {
            apiUrl = '/auth/resetpassword';
            body = {
                email: 'test@a.ab'
            };

            mockUser = { dataValues: _.cloneDeep(MockUser), update: jest.fn() };

            getUser = jest.spyOn(db.user, 'findOne');
            updateUser = jest.spyOn(mockUser, 'update');
        });

        test('Should Return 200: Successfully Reset Password', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue({ ...mockUser, password: 'new passord' });

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeTruthy();
                    expect(res.body?.data?.newPassword).toBeTruthy();
                })
        });

        test('Should Return 500: Password Not Updated', async () => {
            getUser.mockResolvedValue(mockUser);
            updateUser.mockResolvedValue({});

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(500)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 422: Reset using unknown email', async () => {
            getUser.mockResolvedValue({});

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(422)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });

        test('Should Return 400: Bad Request Data', async () => {
            body = {
                email: ''
            }

            await Request(server)
                .post(apiUrl)
                .send(body)
                .expect(400)
                .then(res => {
                    expect(res.body).toBeTruthy();
                })
        });
    });
});