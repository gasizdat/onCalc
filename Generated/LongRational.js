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
            if (value !== Math.floor(value)) {
                console.log(LongRational._helper.decimalSeparators.toString());
            }
            else {
                this._nominator = new onCalc.LongInt(value);
                this._denominator = new onCalc.LongInt(onCalc.LongInt.one);
            }
        };
        LongRational.prototype._initializeString = function (value) {
            console.log(value);
        };
        LongRational.prototype._initializeLongInt = function (value) {
            this._nominator = new onCalc.LongInt(value);
            this._denominator = new onCalc.LongInt(onCalc.LongInt.one);
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
        return LongRational;
    }());
    LongRational._helper = onCalc.LongHelper.instance();
    onCalc.LongRational = LongRational;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongRational.js.map