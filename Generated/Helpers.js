var onCalc;
(function (onCalc) {
    var LongHelper = (function () {
        function LongHelper() {
            this.decimalRank = 1e1;
            this.decimalSeparator = 1.1.toLocaleString().charAt(1);
            this.negativeSign = (-1).toLocaleString().charAt(0);
            /* Evaluation of precision of the number is not to lose accuracy of calculations.
               It must be carried out the system of equations:
             ╓ N = 10^k
             ╢ n = N - 1
             ╙ 3 = n*N - (n*n+n-3)
            */
            var d = 1;
            var k = 0;
            var n = d - 1;
            while (((n * d) - (n * n + n - 3)) == 3) {
                k++;
                d *= 10;
                n = d - 1;
            }
            this.digitLength = k - 1;
            this.digitAbs = 1;
            for (var i = 0; i < this.digitLength; i++)
                this.digitAbs *= 10;
            //Prepare regexp for spliting string value to tokens 
            this._splitter = new RegExp(".{1," + this.digitLength + "}", "g");
            var zeros = "";
            this.leadingZeros = new Array(this.digitLength + 1);
            for (var i = 0; i <= this.digitLength; i++) {
                this.leadingZeros[i] = zeros;
                zeros += "0";
            }
        }
        LongHelper.prototype.tokenize = function (value) {
            var head_size = value.length % this.digitLength;
            var ret;
            if (head_size && (head_size < value.length)) {
                ret = [value.slice(0, head_size)].concat(value.slice(head_size).match(this._splitter));
            }
            else {
                ret = value.match(this._splitter);
            }
            return ret;
        };
        LongHelper.prototype.isNegative = function (value) {
            return value.charAt(0) === this.negativeSign;
        };
        LongHelper.instance = function () {
            return LongHelper._instance;
        };
        return LongHelper;
    }());
    LongHelper._instance = new LongHelper();
    onCalc.LongHelper = LongHelper;
})(onCalc || (onCalc = {}));
var Tests;
(function (Tests) {
    var Assert = (function () {
        function Assert() {
        }
        Assert.equal = function (expected, actual) {
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
        };
        return Assert;
    }());
    Tests.Assert = Assert;
    function EXPECT_EQ(expected, actual) {
        Assert.equal(expected, actual);
    }
    Tests.EXPECT_EQ = EXPECT_EQ;
    function EXPECT_TRUE(actual) {
        Assert.equal(true, actual);
    }
    Tests.EXPECT_TRUE = EXPECT_TRUE;
    function EXPECT_FALSE(actual) {
        Assert.equal(false, actual);
    }
    Tests.EXPECT_FALSE = EXPECT_FALSE;
    function EXPECT_THROW(expression) {
        try {
            expression();
        }
        catch (ex) {
            return;
        }
        throw new EvalError("Expected: throw exception. Actual: normal evaluation");
    }
    Tests.EXPECT_THROW = EXPECT_THROW;
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
        UnitTestsBase.prototype.commutativeAdd = function (x, y, result) {
            var lx = this.longInt(x);
            var ly = this.longInt(y);
            var lresult = this.longInt(result);
            EXPECT_EQ(lresult, lx.add(ly));
            lx = this.longInt(x);
            EXPECT_EQ(lresult, ly.add(lx));
        };
        UnitTestsBase.prototype.stopWatchStart = function () {
            this._StopWatch = Date.now();
        };
        UnitTestsBase.prototype.stopWatchStop = function () {
            return this._StopWatch = Date.now() - this._StopWatch;
        };
        return UnitTestsBase;
    }());
    Tests.UnitTestsBase = UnitTestsBase;
})(Tests || (Tests = {}));
//# sourceMappingURL=Helpers.js.map