/// <reference path="LongIntTests.ts"/>
/// <reference path="../LongRational.ts"/>

function RunAllTests(): void
{
    try
    {
        let positive = new Tests.AnySignUnitTests(false);
        positive.numberToString();
        positive.equalNumberAndStringConstruction();
        positive.equalOperatorTrue();
        positive.equalOperatorFalse();
        positive.notequalOperatorFalse();
        positive.notequalOperatorTrue();
        positive.addOperator();
        positive.mulOperator();

        let negative = new Tests.AnySignUnitTests(true);
        negative.numberToString();
        negative.equalNumberAndStringConstruction();
        negative.equalOperatorTrue();
        negative.equalOperatorFalse();
        negative.notequalOperatorFalse();
        negative.notequalOperatorTrue();
        negative.addOperator();
        negative.mulOperator();

        let sr = new Tests.signRelatedUnitTests();
        sr.equalOperatorFalse();
        sr.notequalOperatorTrueNegAndPos();

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

        sr.bisectionOperator();
        sr.gcdOperator();

        alert("ALL TESTS PASSED");
    }
    catch(ex)
    {
        alert(`Test failed with message: ${(<Error>ex).stack}`);
    }
}
RunAllTests();