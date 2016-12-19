/// <reference path="LongInt.ts"/>
/// <reference path="Helpers.ts"/>
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
        AnySignUnitTests.prototype.equalOperatorFalse = function () {
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
        AnySignUnitTests.prototype.addOperator = function () {
            var _this = this;
            var commutative_add = function (x, y, result) {
                var lx = _this.longInt(x);
                var ly = _this.longInt(y);
                var lresult = _this.longInt(result);
                EXPECT_EQ(lresult, lx.add(ly));
                lx = _this.longInt(x);
                ly = _this.longInt(y);
                EXPECT_EQ(lresult, ly.add(lx));
            };
            commutative_add("1000000000000000000123456", "100500", "1000000000000000000223956");
            commutative_add("999999999999999999999999999999999999999999", "1", "1000000000000000000000000000000000000000000");
        };
        return AnySignUnitTests;
    }(UnitTestsBase));
    var signRelatedUnitTests = (function (_super) {
        __extends(signRelatedUnitTests, _super);
        function signRelatedUnitTests() {
            return _super.call(this, false) || this;
        }
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
        signRelatedUnitTests.prototype.lessPosAndPos = function () {
            var x = this.longInt(0);
            var y = this.longInt(10);
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
            x = this.longInt("100");
            y = this.longInt("101");
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
            x = this.longInt("10099900087718376384324");
            y = this.longInt("10099900087718376384325");
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
            x = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987273");
            y = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987272");
            EXPECT_EQ(true, y.less(x));
            EXPECT_EQ(false, x.less(y));
            x = this.longInt("1020");
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
            x = this.longInt("9876543210987654321");
            y = this.longInt("9876543210987654321");
            EXPECT_EQ(false, y.less(x));
            EXPECT_EQ(false, x.less(y));
            x = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            y = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            EXPECT_EQ(false, y.less(x));
            EXPECT_EQ(false, x.less(y));
        };
        signRelatedUnitTests.prototype.lessPosAndNeg = function () {
            var x = this.longInt("-100");
            var y = this.longInt("100");
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
            x = this.longInt("-876598765987657654309887665000019876555670000001");
            y = this.longInt("876598765987657654309887665000019876555670000001");
            EXPECT_EQ(true, x.less(y));
            EXPECT_EQ(false, y.less(x));
        };
        signRelatedUnitTests.prototype.lessNegAndNeg = function () {
            var x = this.longInt("-100");
            var y = this.longInt("-101");
            EXPECT_EQ(true, y.less(x));
            EXPECT_EQ(false, x.less(y));
            x = this.longInt("-10099900087718376384324");
            y = this.longInt("-10099900087718376384325");
            EXPECT_EQ(true, y.less(x));
            EXPECT_EQ(false, x.less(y));
            x = this.longInt("-876598765987657654309887665000019876555670000001");
            y = this.longInt("-876598765987657654309887665000019876555670000002");
            EXPECT_EQ(true, y.less(x));
            EXPECT_EQ(false, x.less(y));
            x = this.longInt("-876598765987657654309887665000019876555670000002");
            y = this.longInt("-876598765987657654309887665000019876555670000002");
            EXPECT_EQ(false, y.less(x));
            EXPECT_EQ(false, x.less(y));
        };
        signRelatedUnitTests.prototype.lessOrEqualPosAndPos = function () {
            var x = this.longInt("0");
            var y = this.longInt("10");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(true, y.lessOrEqual(x));
            y = this.longInt("666577655343538494836260000987360000000002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
        };
        signRelatedUnitTests.prototype.lessOrEqualPosAndNeg = function () {
            var x = this.longInt("-100");
            var y = this.longInt("10");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            y = this.longInt("600002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_EQ(false, x.lessOrEqual(y));
            EXPECT_EQ(true, y.lessOrEqual(x));
        };
        signRelatedUnitTests.prototype.lessOrEqualNegAndNeg = function () {
            var x = this.longInt("-100");
            var y = this.longInt("-10");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("-666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(true, y.lessOrEqual(x));
            y = this.longInt("-600002");
            EXPECT_EQ(true, x.lessOrEqual(y));
            EXPECT_EQ(false, y.lessOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_EQ(false, x.lessOrEqual(y));
            EXPECT_EQ(true, y.lessOrEqual(x));
        };
        signRelatedUnitTests.prototype.greaterPosAndPos = function () {
            var x = this.longInt(10);
            var y = this.longInt(0);
            EXPECT_EQ(true, x.greater(y));
            EXPECT_EQ(false, y.greater(x));
            x = this.longInt("100500");
            y = this.longInt("101");
            EXPECT_EQ(true, x.greater(y));
            EXPECT_EQ(false, y.greater(x));
            x = this.longInt("10099900087718376384326");
            y = this.longInt("10099900087718376384325");
            EXPECT_EQ(true, x.greater(y));
            EXPECT_EQ(false, y.greater(x));
            x = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987273");
            y = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987275");
            EXPECT_EQ(true, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
            y = this.longInt("1020");
            EXPECT_EQ(true, x.greater(y));
            EXPECT_EQ(false, y.greater(x));
            x = this.longInt("9876543210987654321");
            y = this.longInt("9876543210987654321");
            EXPECT_EQ(false, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
            x = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            y = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            EXPECT_EQ(false, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
        };
        signRelatedUnitTests.prototype.greaterPosAndNeg = function () {
            var x = this.longInt("100");
            var y = this.longInt("-100");
            EXPECT_EQ(true, x.greater(y));
            EXPECT_EQ(false, y.greater(x));
            x = this.longInt("678899987655443332000000000000000000000000000992");
            y = this.longInt("-678899987655443332000000000000000000000000000992");
            EXPECT_EQ(true, x.greater(y));
            EXPECT_EQ(false, y.greater(x));
        };
        signRelatedUnitTests.prototype.greateNegAndNeg = function () {
            var x = this.longInt("-100500");
            var y = this.longInt("-101");
            EXPECT_EQ(true, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
            x = this.longInt("-10099900087718376384324");
            y = this.longInt("-125");
            EXPECT_EQ(true, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
            x = this.longInt("-876598765987657654309887665000019876555670000001");
            y = this.longInt("-776598765987657654309887665000019876555670000001");
            EXPECT_EQ(true, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
            x = this.longInt("-876598765987657654309887665000019876555670000002");
            y = this.longInt("-876598765987657654309887665000019876555670000002");
            EXPECT_EQ(false, y.greater(x));
            EXPECT_EQ(false, x.greater(y));
        };
        signRelatedUnitTests.prototype.greateOrEqualPosAndPos = function () {
            var x = this.longInt("1005000");
            var y = this.longInt("10");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
            x = this.longInt("6665776553435380000000494836250000987360000000002");
            y = this.longInt("6665776553435380000000494836250000987360000000002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(true, y.greaterOrEqual(x));
            y = this.longInt("6665776553435480000000494836250000987360000000002");
            EXPECT_EQ(false, x.greaterOrEqual(y));
            EXPECT_EQ(true, y.greaterOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_EQ(false, x.greaterOrEqual(y));
            EXPECT_EQ(true, y.greaterOrEqual(x));
        };
        signRelatedUnitTests.prototype.greaterOrEqualPosAndNeg = function () {
            var x = this.longInt("100");
            var y = this.longInt("-10");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("-666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
            x = this.longInt("600002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
        };
        signRelatedUnitTests.prototype.greaterOrEqualNegAndNeg = function () {
            var x = this.longInt("-100");
            var y = this.longInt("-1000");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
            x = this.longInt("-6888866577655343538494836250000987360000000002");
            y = this.longInt("-6888866577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(true, y.greaterOrEqual(x));
            x = this.longInt("-600002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_EQ(true, x.greaterOrEqual(y));
            EXPECT_EQ(false, y.greaterOrEqual(x));
        };
        return signRelatedUnitTests;
    }(UnitTestsBase));
    function RunAllTests() {
        try {
            var positive = new AnySignUnitTests(false);
            positive.numberToString();
            positive.equalNumberAndStringConstruction();
            positive.equalOperatorTrue();
            positive.equalOperatorFalse();
            positive.addOperator();
            var negative = new AnySignUnitTests(true);
            negative.numberToString();
            negative.equalNumberAndStringConstruction();
            negative.equalOperatorTrue();
            negative.equalOperatorFalse();
            negative.addOperator();
            var sr = new signRelatedUnitTests();
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
            sr.equalOperatorFalse();
            alert("ALL TESTS PASSED");
        }
        catch (ex) {
            alert("Test failed with message: " + ex.stack);
        }
    }
    RunAllTests();
})(Tests || (Tests = {}));
//# sourceMappingURL=UnitTests.js.map