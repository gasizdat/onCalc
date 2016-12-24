/// <reference path="Helpers.ts"/>
/// <reference path="Interfaces.ts"/>
/// <reference path="LongInt.ts"/>
var onCalc;
(function (onCalc) {
    //The rational number with "unlimited" long nomitator and denominator.
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    var LongRational //implements Rational
     = (function () {
        function LongRational(value) {
            this.value = value;
            this._initialize(value);
        }
        LongRational.prototype._initializeNumber = function (value) {
            if (!isFinite(value))
                throw EvalError("Initialize value is infinite or NaN");
            var e = 1;
            while (value % 1) {
                value *= LongRational._helper.decimalRank;
                e *= LongRational._helper.decimalRank;
            }
            this._nominator = new onCalc.LongInt(value);
            this._denominator = new onCalc.LongInt(e);
        };
        LongRational.prototype._initializeString = function (value) {
            if (!value) {
                this._nominator = new onCalc.LongInt(0);
                this._denominator = new onCalc.LongInt(1);
            }
            else {
                var chunks = value.split(LongRational._helper.naturalSeparator);
                if (chunks.length === 1) {
                    this._nominator = new onCalc.LongInt(chunks[0]);
                    this._denominator = new onCalc.LongInt(1);
                }
                else if (chunks.length === 2) {
                    this._nominator = new onCalc.LongInt(chunks[0]);
                    this._denominator = new onCalc.LongInt(chunks[1]);
                }
                else
                    throw EvalError("Value '" + value + "' isn't valid long rational number.");
            }
        };
        LongRational.prototype._initializeLongInt = function (value) {
            this._nominator = new onCalc.LongInt(value);
            this._denominator = new onCalc.LongInt(1);
        };
        LongRational.prototype._initializeLongRational = function (value) {
            this._nominator = new onCalc.LongInt(value._nominator);
            this._denominator = new onCalc.LongInt(value._denominator);
        };
        LongRational.prototype._initialize = function (value) {
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
            else if (value instanceof onCalc.LongInt) {
                this._initializeLongInt(value);
            }
            else if (value instanceof LongRational) {
                this._initializeLongRational(value);
            }
            else {
                throw new Error("Unsupported value type " + typeof (value));
            }
        };
        LongRational.prototype.negate = function () {
            return this._nominator.negate();
        };
        LongRational.prototype.negative = function () {
            return this._nominator.negative();
        };
        LongRational.prototype.add = function (value) {
            this._nominator.add(new onCalc.LongInt(value).mul(this._denominator));
            return this;
        };
        LongRational.prototype.toString = function () {
            if (this._denominator.equal(onCalc.LongInt.one))
                return this._nominator.toString();
            else
                return "" + this._nominator.toString() + LongRational._helper.naturalSeparator + this._denominator.toString();
        };
        return LongRational;
    }());
    LongRational._helper = onCalc.LongHelper.instance();
    onCalc.LongRational = LongRational;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongRational.js.map