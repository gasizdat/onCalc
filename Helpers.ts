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
                d *= this.decimalRank;
                n = d - 1;
            }
            this.digitLength = k - 1;
            this.digitAbs = 1;
            for(let i: number = 0; i < this.digitLength; i++)
                this.digitAbs *= this.decimalRank;
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
        public readonly naturalSeparator = ":";
        public readonly negativeSign = (-1).toLocaleString().charAt(0);
        public readonly leadingZeros: string[];
        /** Absolute value of LongInt digit. **/
        public readonly digitAbs: number;
        /** String length, for representation one digit (use in parse method) **/
        public readonly digitLength: number;
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

namespace Tests
{
    export class Assert
    {  
        public static equal(expected: string|onCalc.LongInt|number|boolean, actual: string|onCalc.LongInt|number|boolean): void
        {
            let assert: boolean;
            switch(typeof(expected))
            {
                case "string":
                case "number":
                case "boolean":
                    assert = expected === actual;
                    break;
                default: 
                    assert = (<onCalc.LongInt>expected).equal(<onCalc.LongInt>actual);
                    break;
            }
            if(!assert)
            {
                throw new EvalError(`Expected: ${expected}. Actual: ${actual}`);
            }
        }
    }

    export function EXPECT_EQ<T>(expected: T, actual: T): void
    {
        Assert.equal(<any>expected, <any>actual);
    }

    export function EXPECT_TRUE(actual: boolean): void
    {
        Assert.equal(true, actual);
    }

    export function EXPECT_FALSE(actual: boolean): void
    {
        Assert.equal(false, actual);
    }

    export function EXPECT_THROW(expression: any)
    {
        try
        {
            expression();
        }
        catch(ex)
        {
            return;
        }
        throw new EvalError("Expected: throw exception. Actual: normal evaluation");
    }

    export class UnitTestsBase
    {
        private readonly _negative: boolean;
        private _StopWatch: number;
        protected constructor(negative: boolean)
        {
            this._negative = negative;
        }

        protected longInt(value: number | string): onCalc.LongInt
        {
            switch(typeof(value))
            {
                case "string":
                    return new onCalc.LongInt(this.str(<string>value));
                case "number":
                    return new onCalc.LongInt(this.negative() ? -value : value);
                default:
                    throw new Error("Initialize value type not supported");
            }
        }

        protected str(value: string): string
        {
            return ((this.negative() && value !== "0") ? ("-" + value) : value);
        }

        protected readonly negative = () => this._negative;
    
        protected commutativeAdd(x: string, y: string, result: string): void
        {
            let lx = this.longInt(x);
            let ly = this.longInt(y);
            let lresult = this.longInt(result);
            EXPECT_EQ(lresult, lx.add(ly));

            lx = this.longInt(x);
            EXPECT_EQ(lresult, ly.add(lx));
        }

        protected stopWatchStart(): void
        {
            this._StopWatch = Date.now();
        }

        protected stopWatchStop(): number
        {
            return this._StopWatch = Date.now() - this._StopWatch;
        }
    }
}
