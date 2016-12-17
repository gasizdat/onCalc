/// <reference path="LongInt.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    var UnitTestsBase = (function () {
        function UnitTestsBase(negative) {
            var _this = this;
            this.negative = function () { return _this._negative; };
            this._negative = negative;
        }
        UnitTestsBase.prototype.longInt = function (value) {
            switch (typeof (value)) {
                case "string":
                    return new onCalc.LongInt(this.str(value));
                case "number":
                    return new onCalc.LongInt(this.negative() ? -value : value);
                default:
                    throw new Error("Initialize value type not supported");
            }
        };
        UnitTestsBase.prototype.str = function (value) {
            return ((this.negative() && value !== "0") ? ("-" + value) : value);
        };
        return UnitTestsBase;
    }());
    var AnySignUnitTests = (function (_super) {
        __extends(AnySignUnitTests, _super);
        function AnySignUnitTests(negative) {
            return _super.call(this, negative) || this;
        }
        AnySignUnitTests.prototype.numberToString = function () {
            var i = this.longInt(0);
            EXPECT_EQ(this.str("0"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(false, i.negative()); //0 has no sign anyway
            i = this.longInt(100500);
            EXPECT_EQ(this.str("100500"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(this.negative(), i.negative());
            i = this.longInt(10000020000000);
            EXPECT_EQ(this.str("10000020000000"), i.toString());
            EXPECT_EQ(2, i.size());
            EXPECT_EQ(this.negative(), i.negative());
            i = this.longInt(9876543210123456);
            EXPECT_EQ(this.str("9876543210123456"), i.toString());
            EXPECT_EQ(3, i.size());
            EXPECT_EQ(this.negative(), i.negative());
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
        AnySignUnitTests.prototype.equalOperatorTrue = function () {
            var eq = function (x, y) {
                EXPECT_EQ(true, x.equal(x));
                EXPECT_EQ(true, y.equal(y));
                EXPECT_EQ(true, y.equal(x));
                EXPECT_EQ(true, x.equal(y));
            };
            eq(this.longInt(0), this.longInt(0));
            eq(this.longInt(10), this.longInt(10));
            eq(this.longInt(100500), this.longInt(100500));
            eq(this.longInt(99980000997766), this.longInt(99980000997766));
            eq(this.longInt("9999999000000009999997733"), this.longInt("9999999000000009999997733"));
            eq(this.longInt("9876543219876543210987654321123456789123456789123456789"), this.longInt("9876543219876543210987654321123456789123456789123456789"));
        };
        AnySignUnitTests.prototype.equalOperatorFalseForSameSing = function () {
            var eq = function (x, y) {
                EXPECT_EQ(false, y.equal(x));
                EXPECT_EQ(false, x.equal(y));
            };
            eq(this.longInt(1), this.longInt(0));
            eq(this.longInt(10), this.longInt(990010));
            eq(this.longInt(100501), this.longInt(100500));
            eq(this.longInt(99980000997766), this.longInt(99980000997767));
            eq(this.longInt("9999999000000009999997732"), this.longInt("9999999000000009999997733"));
            eq(this.longInt("9876543219876543210987654321123456789123456789123456789"), this.longInt(98));
            eq(this.longInt("98765432198765432109876543211234567891234567891234567890000000001"), this.longInt("98765432198765432109876543211234567891234567891234567890000000000"));
        };
        AnySignUnitTests.prototype.add = function () {
            //99009900990099009900 + 998877665544332211 = 100008778655643342111
            var result = new onCalc.LongInt("99009900990099009900").add(new onCalc.LongInt("998877665544332211"));
            EXPECT_EQ("100008778655643342111", result.toString());
        };
        return AnySignUnitTests;
    }(UnitTestsBase));
    var signRelatedUnitTests = (function (_super) {
        __extends(signRelatedUnitTests, _super);
        function signRelatedUnitTests() {
            return _super.call(this, false) || this;
        }
        signRelatedUnitTests.prototype.lessPositiveAndPositive = function () {
            var x = this.longInt(0);
            var y = this.longInt(10);
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
        };
        signRelatedUnitTests.prototype.equalOperatorFalse = function () {
            var _this = this;
            var eq = function (x, y) {
                var lx = _this.longInt(x);
                var ly = _this.longInt(y);
                EXPECT_EQ(false, ly.equal(lx));
                EXPECT_EQ(false, lx.equal(ly));
                lx = _this.longInt("-" + x);
                EXPECT_EQ(false, ly.equal(lx));
                EXPECT_EQ(false, lx.equal(ly));
                ly = _this.longInt("-" + y);
                EXPECT_EQ(false, ly.equal(lx));
                EXPECT_EQ(false, lx.equal(ly));
                lx = _this.longInt(x);
                ly = _this.longInt("-" + y);
                EXPECT_EQ(false, ly.equal(lx));
                EXPECT_EQ(false, lx.equal(ly));
            };
            eq("1", "2");
            eq("100500", "100499");
            eq("10000000000000500000000000000", "100500");
            eq("9099990000500000000000000", "1059999999999988760");
            eq("9876543219876543210987654321123456789123456789123456789", "98");
            eq("98765432198765432109876543211234567891234567891234567890000000001", "98765432198765432109876543211234567891234567891234567890000000000");
        };
        return signRelatedUnitTests;
    }(UnitTestsBase));
    function RunAllTests() {
        try {
            var positive = new AnySignUnitTests(false);
            positive.numberToString();
            positive.equalNumberAndStringConstruction();
            positive.equalOperatorTrue();
            positive.equalOperatorFalseForSameSing();
            var negative = new AnySignUnitTests(true);
            negative.numberToString();
            negative.equalNumberAndStringConstruction();
            negative.equalOperatorTrue();
            negative.equalOperatorFalseForSameSing();
            var sr = new signRelatedUnitTests();
            sr.lessPositiveAndPositive();
            sr.equalOperatorFalse();
            alert("ALL TESTS PASSED");
        }
        catch (ex) {
            alert("Test failed with message: " + ex.toString());
        }
    }
    RunAllTests();
})(Tests || (Tests = {}));
//# sourceMappingURL=UnitTests.js.map