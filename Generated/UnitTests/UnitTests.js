/// <reference path="LongIntTests.ts"/>
/// <reference path="../LongRational.ts"/>
function RunAllTests() {
    var r = new onCalc.LongRational(-300.665);
    console.log(r.toString());
    r = new onCalc.LongRational(300e30);
    console.log(r.toString());
    try {
        var positive = new Tests.AnySignUnitTests(false);
        positive.numberToString();
        positive.equalNumberAndStringConstruction();
        positive.equalOperatorTrue();
        positive.equalOperatorFalse();
        positive.addOperator();
        positive.mulOperator();
        var negative = new Tests.AnySignUnitTests(true);
        negative.numberToString();
        negative.equalNumberAndStringConstruction();
        negative.equalOperatorTrue();
        negative.equalOperatorFalse();
        negative.addOperator();
        negative.mulOperator();
        var sr = new Tests.signRelatedUnitTests();
        sr.equalOperatorFalse();
        sr.lessPosAndPos();
        sr.lessNegAndNeg();
        sr.lessPosAndNeg();
        sr.lessOrEqualPosAndPos();
        sr.lessOrEqualPosAndNeg();
        sr.lessOrEqualNegAndNeg();
        sr.greaterPosAndPos();
        sr.greaterPosAndNeg();
        sr.greateNegAndNeg();
        sr.greateOrEqualPosAndPos();
        sr.greaterOrEqualPosAndNeg();
        sr.greaterOrEqualNegAndNeg();
        sr.fromReal();
        sr.addOperatorPosAndNeg();
        sr.factorialOperator();
        alert("ALL TESTS PASSED");
    }
    catch (ex) {
        alert("Test failed with message: " + ex.stack);
    }
}
RunAllTests();
//# sourceMappingURL=UnitTests.js.map