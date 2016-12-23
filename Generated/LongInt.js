/// <reference path="Helpers.ts"/>
/// <reference path="Interfaces.ts"/>
var onCalc;
(function (onCalc) {
    //The BCD-like "unlimited" long integer number
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    var LongInt = (function () {
        /*private _absoluteShiftDown(): void
        {
            this._data.shift();
        }*/
        function LongInt(value) {
            var _this = this;
            this.value = value;
            this.size = function () { return _this._data.length; };
            this.negative = function () { return _this._negative; };
            this._initialize(value);
        }
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
                throw new Error("Unsupported value type " + typeof (value));
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
                var s = this.size() - 1;
                var vs = value.size();
                var slice_point = -1;
                for (var i = 0; i <= s; i++) {
                    if (i < vs) {
                        this._data[i] -= value._data[i];
                    }
                    if (this._data[i] < 0) {
                        this._data[i] += LongInt._helper.digitAbs;
                        this._data[i + 1] -= 1;
                    }
                    if (this._data[i] === 0) {
                        slice_point = i;
                    }
                    else {
                        slice_point = -1;
                    }
                }
                if (slice_point > 0) {
                    this._data = this._data.slice(0, slice_point);
                }
            }
        };
        LongInt.prototype._absoluteShiftUp = function (digits) {
            while (digits--) {
                this._data.unshift(0);
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
                this.size() !== value.size() &&
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
        return LongInt;
    }());
    LongInt._helper = onCalc.LongHelper.instance();
    LongInt.zero = new LongInt(0);
    LongInt.one = new LongInt(1);
    onCalc.LongInt = LongInt;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongInt.js.map