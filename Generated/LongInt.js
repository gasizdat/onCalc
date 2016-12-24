/// <reference path="Helpers.ts"/>
/// <reference path="Interfaces.ts"/>
var onCalc;
(function (onCalc) {
    //The BCD-like "unlimited" long integer number
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    var LongInt = (function () {
        function LongInt(value) {
            var _this = this;
            this.value = value;
            this.size = function () { return _this._data.length; };
            this.negative = function () { return _this._negative; };
            this._initialize(value);
        }
        LongInt._absoluteSubFromGreate = function (x, y) {
            var s = x.size() - 1;
            var vs = y.size();
            var slice_point = -1;
            for (var i = 0; i <= s; i++) {
                if (i < vs) {
                    x._data[i] -= y._data[i];
                }
                if (x._data[i] < 0) {
                    x._data[i] += LongInt._helper.digitAbs;
                    x._data[i + 1] -= 1;
                }
                if (x._data[i] === 0) {
                    slice_point = i;
                }
                else {
                    slice_point = -1;
                }
            }
            if (slice_point > 0) {
                x._data = x._data.slice(0, slice_point);
            }
        };
        LongInt.prototype._initializeNumber = function (value) {
            if (!isFinite(value))
                throw EvalError("Initialize value is infinite or NaN");
            this._negative = value < 0;
            this._data = new Array(1);
            this._data[0] = Math.abs(value);
            if (this._data[0] >= LongInt._helper.digitAbs)
                this._bcdNormalize();
        };
        LongInt.prototype._initializeString = function (value) {
            if (!value.length)
                this._initializeNumber(0);
            if (value.length <= LongInt._helper.digitLength) {
                this._initializeNumber(parseInt(value));
            }
            else {
                var data = null;
                this._negative = LongInt._helper.isNegative(value);
                if (this._negative)
                    value = value.slice(1);
                for (var _i = 0, _a = LongInt._helper.tokenize(value); _i < _a.length; _i++) {
                    var token = _a[_i];
                    var digit = parseFloat(token);
                    if (digit && !data) {
                        data = new Array();
                    }
                    if (data) {
                        data.push(digit);
                    }
                }
                if (data)
                    this._data = data.reverse();
            }
        };
        LongInt.prototype._initialize = function (value) {
            var v_type = typeof (value);
            if (!value) {
                this._initializeNumber(0);
            }
            else if (v_type === "string") {
                this._initializeString(value);
            }
            else if (v_type === "number") {
                this._initializeNumber(value);
            }
            else if (value instanceof LongInt) {
                this._negative = value._negative;
                this._data = value._data.slice(0);
            }
            else {
                throw new Error("Unsupported value type " + value);
            }
        };
        LongInt.prototype._absoluteComparison = function (value) {
            var s = this.size();
            var same_size = s === value.size();
            if (same_size) {
                for (s--; s >= 0; s--) {
                    var ld = this._data[s];
                    var rd = value._data[s];
                    if (ld !== rd) {
                        return (ld - rd);
                    }
                }
                return 0; //All digits equals
            }
            else {
                return s - value.size();
            }
        };
        LongInt.prototype._bcdNormalize = function () {
            var d = this._data;
            for (var i = 0; i < d.length; i++) {
                var v = d[i];
                if (v >= LongInt._helper.digitAbs) {
                    var mod = v % LongInt._helper.digitAbs;
                    var quot = Math.floor(v / LongInt._helper.digitAbs);
                    d[i] = mod;
                    var j = i + 1;
                    if (j === d.length) {
                        d.push(quot);
                    }
                    else {
                        d[j] += quot;
                    }
                }
            }
        };
        LongInt.prototype._absoluteAdd = function (value) {
            var s = this.size();
            var sv = value.size();
            var min_s = Math.min(s, sv);
            var i = 0;
            for (; i < min_s; i++) {
                this._data[i] += value._data[i];
            }
            if (i < sv) {
                //TODO Doesn't work properly, understand why.
                //this._data.push.apply(value._data.slice(i));
                this._data = this._data.concat(value._data.slice(i));
            }
            this._bcdNormalize();
        };
        LongInt.prototype._absoluteSub = function (value) {
            var comp = this._absoluteComparison(value);
            if (comp == 0) {
                this._initialize(0);
            }
            else {
                if (comp < 0) {
                    //copy value data and swap with this
                    var tmp_data = value._data;
                    value = new LongInt();
                    value._data = this._data;
                    this._data = tmp_data.slice(0);
                    this._negative = true;
                }
                LongInt._absoluteSubFromGreate(this, value);
            }
        };
        LongInt.prototype._absoluteShiftUp = function (digits) {
            while (digits--) {
                this._data.unshift(0);
            }
        };
        /*private _absoluteShiftDown(): void
        {
            this._data.shift();
        }*/
        LongInt._gcd = function (x, y) {
            /*
                        Very slow algorithm. O(N*log(N)), where N = [x - y]
                        while(x.notequal(y))
                        {
                            if (x.greater(y))
                                LongInt._absoluteSubFromGreate(x, y);
                            else
                                LongInt._absoluteSubFromGreate(y, x);
                        }
                        return x;
            */
            if (x.equal(y)) {
                return x;
            }
            else if (x.equal(LongInt.one) || y.equal(LongInt.one)) {
                return LongInt.one;
            }
            else {
                var x_even = x.isEven();
                var y_even = y.isEven();
                if (x_even) {
                    if (!y_even) {
                        return LongInt.gcd(x.bisect(), y);
                    }
                    else {
                        return LongInt.gcd(x.bisect(), y.bisect()).mul(LongInt.two);
                    }
                }
                else if (!y_even) {
                    return LongInt.gcd(x, y.bisect());
                }
                else if (x.greater(y)) {
                    LongInt._absoluteSubFromGreate(x, y);
                    return LongInt.gcd(x.bisect(), y);
                }
                else {
                    LongInt._absoluteSubFromGreate(y, x);
                    return LongInt.gcd(y.bisect(), x);
                }
            }
        };
        LongInt.prototype.assigned = function (value) {
            this._initialize(value);
            return this;
        };
        LongInt.prototype.equal = function (value) {
            return this._negative === value._negative &&
                this.size() === value.size() &&
                this._data.every(function (d, i) { return d === value._data[i]; });
        };
        LongInt.prototype.notequal = function (value) {
            return this._negative !== value._negative ||
                this.size() !== value.size() ||
                this._data.some(function (d, i) { return d !== value._data[i]; });
        };
        LongInt.prototype.greater = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteComparison(value) < 0 :
                    this._absoluteComparison(value) > 0;
            }
            else {
                return value._negative;
            }
        };
        LongInt.prototype.greaterOrEqual = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteComparison(value) <= 0 :
                    this._absoluteComparison(value) >= 0;
            }
            else {
                return value._negative;
            }
        };
        LongInt.prototype.less = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteComparison(value) > 0 :
                    this._absoluteComparison(value) < 0;
            }
            else {
                return this._negative;
            }
        };
        LongInt.prototype.lessOrEqual = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteComparison(value) >= 0 :
                    this._absoluteComparison(value) <= 0;
            }
            else {
                return this._negative;
            }
        };
        LongInt.prototype.add = function (value) {
            if (this._negative === value._negative) {
                //(+x) + (+y) = +(x + y)
                //(-x) + (-y) = -(x + y)
                this._absoluteAdd(value);
            }
            else if (!this._negative) {
                //(+x) + (-y) = x - y
                this._absoluteSub(value);
            }
            else {
                //(-x) + (+y) = (+y) - (+x)
                this._negative = false;
                value = new LongInt(value);
                value._absoluteSub(this);
                this._data = value._data;
                this._negative = value._negative;
            }
            return this;
        };
        LongInt.prototype.sub = function (value) {
            if (this._negative !== value._negative) {
                //(-x) - (+y) = -(x + y)
                //(+x) - (-y) = +(x + y)
                this._absoluteAdd(value);
            }
            else if (this._negative) {
                //(-x) - (-y) = y - x
                this._negative = false;
                value = new LongInt(value);
                value._negative = false;
                value.sub(this);
                this._data = value._data;
                this._negative = value._negative;
            }
            else {
                this._absoluteSub(value);
            }
            return this;
        };
        LongInt.prototype.mul = function (value) {
            var result = new onCalc.LongInt();
            var temp_result = new onCalc.LongInt();
            this._data.forEach(function (x, i) {
                temp_result._data = new Array(value.size());
                value._data.forEach(function (y, j) {
                    temp_result._data[j] = x * y;
                });
                temp_result._absoluteShiftUp(i);
                result._absoluteAdd(temp_result);
            });
            this._data = result._data;
            this._negative = this._negative !== value._negative;
            return this;
        };
        LongInt.prototype.factorial = function () {
            if (this._negative)
                throw new EvalError("factorial(n) determined for natural numbers only!");
            var result = new LongInt(LongInt.one);
            while (this.greater(LongInt.zero)) {
                result.mul(this);
                this.decrement();
            }
            this._data = result._data;
            return this;
        };
        LongInt.prototype.increment = function () {
            return this.add(LongInt.one);
        };
        LongInt.prototype.decrement = function () {
            return this.sub(LongInt.one);
        };
        LongInt.prototype.negate = function () {
            this._negative = !this._negative;
            return this._negative;
        };
        LongInt.prototype.toString = function () {
            var ret = "";
            //TS bug value, index, array - implicit any, but fine compiling
            this._data.forEach(function (value, index, array) {
                var digit = value.toString();
                var zeros_count = LongInt._helper.digitLength - digit.length;
                if (zeros_count && index < (array.length - 1)) {
                    ret = LongInt._helper.leadingZeros[zeros_count] + digit + ret;
                }
                else {
                    ret = digit + ret;
                }
            });
            return this._negative ? (LongInt._helper.negativeSign + ret) : ret;
        };
        LongInt.prototype.isOdd = function () {
            return (this._data[0] % 2) !== 0;
        };
        LongInt.prototype.isEven = function () {
            return (this._data[0] % 2) === 0;
        };
        LongInt.prototype.bisect = function () {
            var _this = this;
            var half_rank = LongInt._helper.digitAbs / 2;
            this._data.forEach(function (v, i, a) {
                if (i > 0 && (v % 2) !== 0) {
                    a[i - 1] += half_rank;
                }
                if (v === 1 && i === (a.length - 1)) {
                    _this._data.pop();
                }
                else {
                    a[i] = Math.floor(v / 2);
                }
            });
            return this;
        };
        LongInt.gcd = function (x, y) {
            return LongInt._gcd(new LongInt(x), new LongInt(y));
        };
        return LongInt;
    }());
    LongInt._helper = onCalc.LongHelper.instance();
    LongInt.zero = new LongInt(0);
    LongInt.one = new LongInt(1);
    LongInt.two = new LongInt(2);
    onCalc.LongInt = LongInt;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongInt.js.map