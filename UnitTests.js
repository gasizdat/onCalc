/// <reference path="LongInt.ts"/>
var Tests;
(function (Tests) {
    var UnitTests = (function () {
        function UnitTests() {
        }
        UnitTests.EXPECT_EQ = function (expected, actual) {
            var assert;
            if (typeof (expected) === "string") {
                assert = expected === actual;
            }
            else {
                assert = expected.equal(actual);
            }
            if (!assert) {
                throw new EvalError("Expected: " + expected.toString() + ". Actual: " + actual.toString());
            }
        };
        UnitTests.Add = function () {
            //99009900990099009900 + 998877665544332211 = 100008778655643342111
            var result = new onCalc.LongInt("99009900990099009900").add(new onCalc.LongInt("998877665544332211"));
            UnitTests.EXPECT_EQ(new onCalc.LongInt("100008778655643342111"), result);
            UnitTests.EXPECT_EQ("100008778655643342111", result.toString());
        };
        UnitTests.RunAllTests = function () {
            try {
                UnitTests.Add();
                alert("ALL TESTS PASSED");
            }
            catch (ex) {
                alert("Test failed with message: " + ex.toString());
            }
        };
        return UnitTests;
    }());
    Tests.UnitTests = UnitTests;
    UnitTests.RunAllTests();
})(Tests || (Tests = {}));
//# sourceMappingURL=UnitTests.js.map