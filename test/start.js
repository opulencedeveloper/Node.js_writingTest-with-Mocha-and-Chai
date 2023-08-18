//the folder where this file is in, has to be named 'test'
//the mocha package is responsible for running our test, and gives us fn like 'it()' the defines the test,
//the chai package is responsible for defining our success conditions

const expect = require('chai').expect;

//it() => the first argument passed here describes your test
//the second argument is a fn that holds the test code

// it('should add numbers correctly', function() {
//     const num1 = 2;
//     const num2 = 3;
//     expect(num1 + num2).to.equal(5);
// })

// //it() => the first argument passed here describes your test
// //the second argument is a fn that holds the test code
// it('should should not give a result of 6', function() {
//     const num1 = 3;
//     const num2 = 3;
//     expect(num1 + num2).not.to.equal(6);
// })