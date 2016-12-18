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
        LongInt.prototype._initializeNumber = function (value) {
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
        LongInt.prototype._absoluteGreater = function (value, or_equal) {
            var s = this.size();
            var same_size = s === value.size();
            if (same_size) {
                for (s--; s >= 0; s--) {
                    var ld = this._data[s];
                    var rd = value._data[s];
                    if (ld !== rd) {
                        return ld > rd;
                    }
                }
                return or_equal; //All digits equals
            }
            else {
                return s > value.size();
            }
        };
        LongInt.prototype._absoluteLess = function (value, or_equal) {
            var s = this.size();
            var same_size = s === value.size();
            if (same_size) {
                for (s--; s >= 0; s--) {
                    var ld = this._data[s];
                    var rd = value._data[s];
                    if (ld !== rd) {
                        return ld < rd;
                    }
                }
                return or_equal; //All digits equals
            }
            else {
                return s < value.size();
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
            var max_s = Math.max(s, value.size());
            for (var i = 0; i < s; i++) {
                if (s <= i) {
                    this._data.push(value._data[i]);
                }
                else {
                    this._data[i] += value._data[i];
                }
            }
            this._bcdNormalize();
        };
        LongInt.prototype._absoluteSubLessOrEqualValue = function (value) {
            //! Value must be less or equal than this !
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
            else if (s === 0)
                this._initialize(0);
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
                    this._absoluteLess(value, false) :
                    this._absoluteGreater(value, false);
            }
            else {
                return !value._negative;
            }
        };
        LongInt.prototype.greaterOrEqual = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteLess(value, true) :
                    this._absoluteGreater(value, true);
            }
            else {
                return !value._negative;
            }
        };
        LongInt.prototype.less = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteGreater(value, false) :
                    this._absoluteLess(value, false);
            }
            else {
                return this._negative;
            }
        };
        LongInt.prototype.lessOrEqual = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteGreater(value, true) :
                    this._absoluteLess(value, true);
            }
            else {
                return this._negative;
            }
        };
        LongInt.prototype.add = function (value) {
            if (this._negative === value._negative) {
                this._absoluteAdd(value);
                return this;
            }
            else {
                return this.sub(value);
            }
        };
        LongInt.prototype.sub = function (value) {
            if (this._negative !== value._negative) {
                //(-x) - (+y) = -(x + y)
                //(+x) - (-y) = +(x + y)
                this._absoluteAdd(value);
                return this;
            }
            else if (this._negative) {
                //(-x) - (-y) = -x + y
                value = new LongInt(value);
                value._negative = false;
            }
            if (this.less(value)) {
                var tmp_data = value._data;
                value = this;
                this._data = tmp_data;
                this._negative = true;
            }
            this._absoluteSubLessOrEqualValue(value);
        };
        LongInt.prototype.toString = function () {
            var ret = "";
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
    LongInt._helper = new onCalc.LongIntHelper();
    onCalc.LongInt = LongInt;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongInt.js.map