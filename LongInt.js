var onCalc;
(function (onCalc) {
    var LongIntHelper = (function () {
        function LongIntHelper() {
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
        LongIntHelper.prototype.tokenize = function (value) {
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
        LongIntHelper.prototype.isNegative = function (value) {
            return value.charAt(0) === '-';
        };
        return LongIntHelper;
    }());
    //The BCD-like "unlimited" long integer number
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    var LongInt = (function () {
        function LongInt(value) {
            var _this = this;
            this.value = value;
            this.size = function () { return _this._data.length; };
            this._initialize(value);
        }
        LongInt.prototype._initializeNumber = function (value) {
            this._negative = value < 0;
            this._data = new Array(1);
            this._data[0] = Math.abs(value);
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
            if (!value) {
                this._initializeNumber(0);
            }
            else if (value instanceof String) {
                this._initializeString(value);
            }
            else if (value instanceof Number) {
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
            this._data.forEach(function (v, i, a) {
                if (v >= LongInt._helper.digitAbs) {
                    var mod = v % LongInt._helper.digitAbs;
                    var quot = Math.floor(v / LongInt._helper.digitAbs);
                    a[i] = mod;
                    i++;
                    if (a.length === i) {
                        a.push(quot);
                    }
                    else {
                        a[i] += quot;
                    }
                }
            });
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
                return value._negative;
            }
        };
        LongInt.prototype.lessOrEqual = function (value) {
            if (this._negative === value._negative) {
                return this._negative ?
                    this._absoluteGreater(value, true) :
                    this._absoluteLess(value, true);
            }
            else {
                return value._negative;
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
            if (!this._negative && value._negative) {
                return this.add(value);
            }
            else if (this._negative && !value._negative) {
                this._absoluteAdd(value);
                this._negative = false;
                return this;
            }
        };
        LongInt.prototype.toString = function () {
            var ret = "";
            this._data.forEach(function (value, index, array) {
                var digit = value.toString();
                var zeros_count = LongInt._helper.digitLength - digit.length;
                if (zeros_count && index < (array.length - 1)) {
                    ret = LongInt._helper.leadingZeros[zeros_count] + value + ret;
                }
                else {
                    ret = value + ret;
                }
            });
            return ret;
        };
        return LongInt;
    }());
    LongInt._helper = new LongIntHelper();
    onCalc.LongInt = LongInt;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongInt.js.map