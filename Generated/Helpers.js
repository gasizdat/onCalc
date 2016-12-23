var onCalc;
(function (onCalc) {
    var LongHelper = (function () {
        function LongHelper() {
            this.decimalSeparators = [1.1.toLocaleString().charAt(1), "."];
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
//# sourceMappingURL=Helpers.js.map