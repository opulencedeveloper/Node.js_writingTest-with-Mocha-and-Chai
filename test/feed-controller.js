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
const FeedController = require("../controllers/feed");

//[IN THIS TEST, I USED A REAL DB FOR TEST, INTEAD OF USING 'stub' from the sinon package to
//simulate the out of the db, if a certain value was passed it it]

//this is a test for the feed.js file in the controller folder
//describe() => groups test, to make the test organised
//the 1st argruement passed to describe, is a text that describes what the grouped test is about
//'done' is used for async code, which this is one

describe("Feed Controller", function (done) {
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
  it("should add a created post to the posts of the creator", function (done) {
    //here we defined what the structure of data in the req and res obj you
    //should expect that should add a created post to the posts of the creator
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    //this is where we state the line of code we are testing
    //we added a 'return' statement of the end of this fn in the controller folder in the auth.js file
    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
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
