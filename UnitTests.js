/// <reference path="LongInt.ts"/>
var Tests;
(function (Tests) {
    var LongInt = function (value) { return new onCalc.LongInt(value); };
    var UnitTests = (function () {
        function UnitTests() {
        }
        UnitTests.EXPECT_EQ = function (expected, actual) {
            var assert;
            switch (typeof (expected)) {
                case "string":
                    assert = expected === actual;
                    break;
                case "number":
                    assert = expected === actual;
                    break;
                default:
                    assert = expected.equal(actual);
                    break;
            }
            if (!assert) {
                throw new EvalError("Expected: " + expected.toString() + ". Actual: " + actual.toString());
            }
        };
        UnitTests.PositiveNumberToString = function () {
            var i = LongInt(0);
            UnitTests.EXPECT_EQ("0", i.toString());
            UnitTests.EXPECT_EQ(1, i.size());
            i = LongInt(100500);
            UnitTests.EXPECT_EQ("100500", i.toString());
            UnitTests.EXPECT_EQ(1, i.size());
            i = LongInt(10000020000000);
            UnitTests.EXPECT_EQ("10000020000000", i.toString());
            UnitTests.EXPECT_EQ(2, i.size());
            i = LongInt(9876543210123456);
            UnitTests.EXPECT_EQ("9876543210123456", i.toString());
            UnitTests.EXPECT_EQ(3, i.size());
        };
        UnitTests.NegativeNumberToString = function () {
            UnitTests.EXPECT_EQ("-10", new onCalc.LongInt(-10).toString());
            UnitTests.EXPECT_EQ("-100500", new onCalc.LongInt(-100500).toString());
            UnitTests.EXPECT_EQ("-9876543210123456", new onCalc.LongInt(-9876543210123456).toString());
        };
        UnitTests.Add = function () {
            //99009900990099009900 + 998877665544332211 = 100008778655643342111
            var result = new onCalc.LongInt("99009900990099009900").add(new onCalc.LongInt("998877665544332211"));
            UnitTests.EXPECT_EQ("100008778655643342111", result.toString());
        };
        UnitTests.RunAllTests = function () {
            try {
                UnitTests.PositiveNumberToString();
                UnitTests.NegativeNumberToString();
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