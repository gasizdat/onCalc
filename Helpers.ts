namespace onCalc
{
    export class LongHelper
    {
        private static readonly _instance = new LongHelper();
        private readonly _splitter: RegExp;
        constructor()
        {
            /* Evaluation of precision of the number is not to lose accuracy of calculations.
               It must be carried out the system of equations:
             ╓ N = 10^k
             ╢ n = N - 1
             ╙ 3 = n*N - (n*n+n-3)
            */
            let d: number = 1;
            let k: number = 0;
            let n: number = d - 1;
            while(((n*d) - (n*n + n - 3)) == 3)
            {
                k++;
                d *= 10;
                n = d - 1;
            }
            this.digitLength = k - 1;
            this.digitAbs = 1;
            for(let i: number = 0; i < this.digitLength; i++)
                this.digitAbs *= 10;
            //Prepare regexp for spliting string value to tokens 
            this._splitter = new RegExp(".{1," + this.digitLength + "}", "g");
            let zeros: string = "";
            this.leadingZeros = new Array<string>(this.digitLength + 1);
            for(let i = 0; i <= this.digitLength; i++)
            {
                this.leadingZeros[i] = zeros;
                zeros += "0";
            }
        }

        public readonly decimalRank = 1e1;
        public readonly decimalSeparator = 1.1.toLocaleString().charAt(1);
        public readonly negativeSign = (-1).toLocaleString().charAt(0);
        public readonly leadingZeros: string[];
        public readonly digitAbs: number; //Absolute value of LongInt digit.
        public readonly digitLength: number; //String length, for representation one digit (use in parse method)
        public tokenize(value: string): Array<string>
        {
            let head_size = value.length % this.digitLength;
            let ret: Array<string>;
            if(head_size && (head_size < value.length))
            {
                ret = [value.slice(0, head_size)].concat(value.slice(head_size).match(this._splitter));
            }
            else
            {
                ret = value.match(this._splitter);
            }
            return ret;
        }
        public isNegative(value: string) : boolean
        {
            return value.charAt(0) === this.negativeSign;
        }
        public static instance(): LongHelper
        {
            return LongHelper._instance;
        }
    }
}