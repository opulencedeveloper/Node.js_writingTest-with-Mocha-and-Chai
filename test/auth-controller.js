//the folder where this file is in, has to be named 'test'
//the mocha package is responsible for running our test, and gives us fn like 'it()' the defines the test,
//the chai package is responsible for defining our success conditions

const expect = require("chai").expect;
const mongoose = require("mongoose");

//when you want to test a code where a packages is use, eg, you want to test a situtaion whereby
//the jwt fn from the json webtoken package returns success when it validates a token.
//in this test, you overwrite this fn to always return true, now you have overwritten the functionaities
//of this fn and you need to return it back to how it was before, the' sinon' package helps you achieve that
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

//[IN THIS TEST, I USED A REAL DB FOR TEST, INTEAD OF USING 'stub' from the sinon package to
//simulate the out of the db, if a certain value was passed it it]

//this is a test for the auth.js file in the controller folder
//describe() => groups test, to make the test organised
//the 1st argruement passed to describe, is a text that describes what the grouped test is about
//'done' is used for async code, which this is one

describe("Auth Controller", function (done) {
  //'before()' the test code inside 'before()' runs ones before all test code
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://testeropulence:fmFLrB6d1KjNzKag@cluster0-ntrwp.mongodb.net/test-messages?retryWrites=true"
      )
      .then((result) => {
        //here we create a dummy user
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        //done(): is used for async test, that is called when this async test is done
        //you can increase the time-out of this process in the package.json file which I already
        done();
      });
  });

  //beforeEach() is for initailization that runs before every test code
  //the syntax below
  //beforeEach(function(done){})

  //afterEach()  runs after every test code, can be usesful for clean up
  //the syntax below
  //beforeEach(function(done){})

  //it() => the first argument passed here describes your test
  //the second argument is a fn that holds the test code
  //'done' is used for async code, which this is one
  it("should throw an error with code 500 if accessing the database fails", function (done) {
    //this(sinon.stub) replaces the actual behaviour of this package with a fix response
    //I expained what this is doing where I imported this package(sinon) above
    //User is where the fn is coming from, findOne is the fn
    sinon.stub(User, "findOne");
    User.findOne.throws();

    //here we defined what the structure of data in the req obj you should expect that should
    //throw an error with code 500 if accessing the database fails
    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    //this is where we state the line of code we are testing
    //we added a 'return' statement of the end of this fn in the controller folder in the auth.js file
    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      //done(): is used for async test, that is called when this async test is done
      //you can increase the time-out of this process in the package.json file which I already
      done();
    });

    //since we overwrite(stub) this fn to get the value we want just to make sure
    //our test runs successfully, we store this fn to its normal state
    User.findOne.restore();
  });

  //it() => the first argument passed here describes your test
  //the second argument is a fn that holds the test code
  //'done' is used for async code, which this is one
  //we used a database for this test instead of simulating the response of a database using stub from the sinon package
  it("should send a response with a valid user status for an existing user", function (done) {
    //here we defined what the structure of data in the req and res obj you should expect that
    //should send a response with a valid user status for an existing user
    const req = { userId: "5c0f66b979af55031b34728a" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    //this is where we state the line of code we are testing
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
      //done(): is used for async test, that is called when this async test is done
      //you can increase the time-out of this process in the package.json file which I already
      done();
    });
  });

  //'done' is used for async code, which this is one
  //the code inside after(), runs after all your test cases
  after(function (done) {
    //this deletes all users in our test db
    //for clean up
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        //done(): is used for async test, that is called when this async test is done
        //you can increase the time-out of this process in the package.json file which I already did
        done();
      });
  });
});
