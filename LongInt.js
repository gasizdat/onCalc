function testLongInt() {
    var _limits = new onCalc.Limiter();
    var i1 = new onCalc.LongInt(100);
    var i2 = new onCalc.LongInt("100500");
}
var onCalc;
(function (onCalc) {
    var Limiter = (function () {
        function Limiter() {
            for (var i = 32;; i++) {
                var value = Math.pow(2, i);
                var str_value = value.toFixed();
                if (value != Math.floor((new Number(str_value)))) {
                    break;
                }
                else {
                    this.maxStoredNumber = value;
                    this.digitsInNumber = str_value.length;
                }
            }
        }
        return Limiter;
    }());
    onCalc.Limiter = Limiter;
    var LongInt = (function () {
        function LongInt(value) {
            this._initialize(value);
        }
        LongInt.prototype._initializeNumber = function (value) {
            this._sign = value < 0;
            this._data = new Array(1);
            this._data[0] = Math.abs(value);
        };
        LongInt.prototype._initializeString = function (value) {
            if (!value.length)
                this._initializeNumber(0);
            this._sign = value.charAt(0) !== '-';
            /*
                        this._data.push(Math.abs(value));*/
        };
        LongInt.prototype._initialize = function (value) {
            if (!value)
                this._initializeNumber(0);
            else {
                switch (typeof (value)) {
                    case "string":
                        this._initializeString(value);
                        break;
                    case "number":
                        this._initializeNumber(value);
                        break;
                    default:
                        throw new Error("Unsupported value type " + typeof (value));
                }
            }
        };
        LongInt.prototype.assigned = function (value) {
            this._initialize(value);
            return this;
        };
        return LongInt;
    }());
    onCalc.LongInt = LongInt;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongInt.js.map