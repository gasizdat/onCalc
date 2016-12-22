/// <reference path="Helpers.ts"/>
/// <reference path="Interfaces.ts"/>
var onCalc;
(function (onCalc) {
    //The rational number with "unlimited" long nomitator and denominator.
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    var LongRational = (function () {
        function LongRational() {
        }
        return LongRational;
    }());
    onCalc.LongRational = LongRational;
})(onCalc || (onCalc = {}));
//# sourceMappingURL=LongRational.js.map