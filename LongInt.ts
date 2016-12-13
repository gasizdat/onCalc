function testLongInt()
{
    let i1 = new onCalc.LongInt(100);
    let i2 = new onCalc.LongInt("100500");
} 

namespace onCalc
{
    class Preprocessor
    {
        private _splitter: RegExp;
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
        }

        public digitAbs: number; //Absolute value of LongInt digit.
        public digitLength: number; //String length, for representation one digit (use in parse method)
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
        public static isNegative(value: string) : boolean
        {
            return value.charAt(0) === '-';
        }
    }

    const _preprocessor = new Preprocessor();
    type ValueType = string | number;
    //The BCD-like "unlimited" long integer number
    export class LongInt
    {
        private _negative: boolean;
        private _data: Array<number>;

        private _initializeNumber(value: number)
        {
            this._negative = value < 0;
            this._data = new Array<number>(1);
            this._data[0] = Math.abs(value);
        }
        private _initializeString(value: string)
        {
            if(!value.length)
                this._initializeNumber(0);
            if(value.length <= _preprocessor.digitLength)
            {
                this._initializeNumber(parseInt(value));
            }
            else
            {
                let data: Array<number> = null;
                this._negative = Preprocessor.isNegative(value);
                if (this._negative)
                    value = value.slice(1);
                for (let token of _preprocessor.tokenize(value))
                {
                    let digit = parseFloat(token);
                    if (digit && !data)
                    {
                        data = new Array<number>();
                    }
                    if (data)
                    {
                        data.push(digit);
                    }   
                }
                if (data)
                    this._data=data.reverse();
            }
        }

        private _initialize(value?: ValueType)
        {
            if(!value)
                this._initializeNumber(0);
            else 
            {
                switch(typeof(value))
                {
                    case "string":
                        this._initializeString(<string>value);
                        break;
                    case "number":
                        this._initializeNumber(<number>value);
                        break;
                    default:
                        throw new Error("Unsupported value type " + typeof(value));
                }
            }
        }

        public constructor(value?: ValueType)
        {
            this._initialize(value);
        }

        public assigned(value?: ValueType) : LongInt
        {
            this._initialize(value);
            return this;
        }

        public parse(value: string) : void
        {
            this._initialize(value);
        }
    }
    function x()
    {
        let i = new LongInt("1234567890");
        i = new LongInt("-1234567890");
        i = new LongInt("12345678909876543210");
        i = new LongInt("-12345678909876543210");
        i = new LongInt("-00000000005");
        i = new LongInt("00000000000000000500");
        
    }
    x();
}