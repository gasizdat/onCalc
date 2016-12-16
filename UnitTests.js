/// <reference path="LongInt.ts"/>
var Tests;
(function (Tests) {
    function EXPECT_EQ(expected, actual) {
        var assert;
        switch (typeof (expected)) {
            case "string":
            case "number":
            case "boolean":
                assert = expected === actual;
                break;
            default:
                assert = expected.equal(actual);
                break;
        }
        if (!assert) {
            throw new EvalError("Expected: " + expected.toString() + ". Actual: " + actual.toString());
        }
    }
    var AnySignUnitTests = (function () {
        function AnySignUnitTests(negative) {
            this._negative = negative;
        }
        AnySignUnitTests.prototype.longInt = function (value) {
            switch (typeof (value)) {
                case "string":
                    return new onCalc.LongInt(this._negative ? "-" + value : value);
                case "number":
                    return new onCalc.LongInt(this._negative ? -value : value);
                default:
                    throw new Error("Initialize value type not supported");
            }
        };
        AnySignUnitTests.prototype.str = function (value) {
            return ((this._negative && value !== "0") ? ("-" + value) : value);
        };
        AnySignUnitTests.prototype.numberToString = function () {
            var i = this.longInt(0);
            EXPECT_EQ(this.str("0"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(false, i.negative()); //0 has no sign anyway
            i = this.longInt(100500);
            EXPECT_EQ(this.str("100500"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(this._negative, i.negative());
            i = this.longInt(10000020000000);
            EXPECT_EQ(this.str("10000020000000"), i.toString());
            EXPECT_EQ(2, i.size());
            EXPECT_EQ(this._negative, i.negative());
            i = this.longInt(9876543210123456);
            EXPECT_EQ(this.str("9876543210123456"), i.toString());
            EXPECT_EQ(3, i.size());
            EXPECT_EQ(this._negative, i.negative());
        };
        AnySignUnitTests.prototype.equalNumberAndStringConstruction = function () {
            var x = this.longInt(0);
            var y = this.longInt("0");
            EXPECT_EQ(x, y);
            x = this.longInt(100);
            y = this.longInt("100");
            EXPECT_EQ(x, y);
            x = this.longInt(100500);
            y = this.longInt("100500");
            EXPECT_EQ(x, y);
            x = this.longInt(10000000);
            y = this.longInt("10000000");
            EXPECT_EQ(x, y);
            x = this.longInt(10000000000);
            y = this.longInt("10000000000");
            EXPECT_EQ(x, y);
            x = this.longInt(12345670009900);
            y = this.longInt("12345670009900");
            EXPECT_EQ(x, y);
            x = this.longInt(31415926535897932);
            y = this.longInt("31415926535897932");
            EXPECT_EQ(x, y);
        };
        AnySignUnitTests.prototype.add = function () {
            //99009900990099009900 + 998877665544332211 = 100008778655643342111
            var result = new onCalc.LongInt("99009900990099009900").add(new onCalc.LongInt("998877665544332211"));
            EXPECT_EQ("100008778655643342111", result.toString());
        };
        return AnySignUnitTests;
    }());
    function RunAllTests() {
        try {
            var positive = new AnySignUnitTests(false);
            positive.numberToString();
            positive.equalNumberAndStringConstruction();
            var negative = new AnySignUnitTests(true);
            negative.numberToString();
            negative.equalNumberAndStringConstruction();
            alert("ALL TESTS PASSED");
        }
        catch (ex) {
            alert("Test failed with message: " + ex.toString());
        }
    }
    RunAllTests();
})(Tests || (Tests = {}));
//# sourceMappingURL=UnitTests.js.map