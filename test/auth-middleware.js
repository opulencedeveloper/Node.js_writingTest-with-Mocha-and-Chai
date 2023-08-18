//the folder where this file is in, has to be named 'test'
//the mocha package is responsible for running our test, and gives us fn like 'it()' the defines the test,
//the chai package is responsible for defining our success conditions

const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
//when you want to test a code where a packages is use, eg, you want to test a situtaion whereby
//the jwt fn from the json webtoken package returns success when it validates a token.
//in this test, you overwrite this fn to always return true, now you have overwritten the functionaities
//of this fn and you need to return it back to how it was before, the' sinon' package helps you achieve that
//like making it to return that value we want, for this test to pass
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

//describe() => groups test, to make the test organised
//the 1st argruement passed to describe, is a text that describes what the grouped test is about
describe("Auth middleware test", function () {
  //it() => the first argument passed here describes your test
  //the second argument is a fn that holds the test code
  //this is a test for the is-auth.js file in the middleware folder
  it("should throw an error with an error message 'Not authenticated.' if no authorization header is present", function () {
    //here we defined what should be in the req object that causes the error
    const req = {
      get: function () {
        return null;
      },
    };
    //bind ensures that the argument pased here are only included when this test is called
    //not when the real fn runs in the is-auth file
    //this text -> 'Not authenticated.' should  match the Error text your'e throwing in the is-auth.js file
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  //it() => the first argument passed here describes your test
  //the second argument is a fn that holds the test code
  //this is a test for the auth.js file in the middleware folder
  it("should throw an error if the authorization header is only one String", function () {
    //here we defined what should be in the req object that causes the error, which is if it only has 1 string
    const req = {
      get: function () {
        return "xyz";
      },
    };
    //bind ensures that the argument pased here are only included when this test is called
    //not when the real fn runs in the is-auth file
    //this is where we state the line of code we are testing
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });




    //it() => the first argument passed here describes your test
  //the second argument is a fn that holds the test code
  //this is a test for the auth.js file in the middleware folder
  it("should yield a userId after decoding the token", function () {
    //here we defined the structure of data in the req obj you should expect that should yield a userId after decoding the token
    const req = {
      get: function (headerName) {
        return "Bearer djfkalsdjfaslfjdlas";
      },
    };
    //this(sinon.stub) replaces the actual behaviour of this package with a fix response
    //I expained what this is doing where I imported this package(sinon) above
    //jwt is where the fn is coming from, verify is the fn
    sinon.stub(jwt, 'verify');
    
    // here we are replacing the jwt.verify fn to always return a token of 'abc',
    //so we can use this to complete our test of when the real jwt.verfy() fn successeds
    //this syntax was made possibe due to the "sinon.stub" code above
    jwt.verify.returns({userId: "abc"});
    //this is where we state the line of code we are testing
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true; //this test if the jwt.verify method was called
    
    //since we overwrite(stub) this fn to always return true when {userId: abc} just to make sure
    //our test runs successfully, we store this fn to its normal state
    jwt.verify.restore();
  });





    //it() => the first argument passed here describes your test
  //the second argument is a fn that holds the test code
  //this is a test for the auth.js file in the middleware folder
  it("should throw an error if the token cannot be verified", function () {
    //here we defined the structure of data in the req obj you should expect that should throw an error if the token cannot be verified
    const req = {
        get: function(headerName) {
          return 'Bearer xyz';
        }
      };
    //bind ensures that the argument pased here are only included when this test is called
    //not when the real fn runs in the is-auth file
    //this is where we state the line of code we are testing
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });




});
