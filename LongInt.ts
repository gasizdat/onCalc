module onCalc
{
    class LongIntHelper
    {
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

        public readonly negativeSign = "-";
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
    }

    export type ValueType = string | number | LongInt;
    //The BCD-like "unlimited" long integer number
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    export class LongInt
    {
        private static readonly _helper = new LongIntHelper();
        private _negative: boolean;
        private _data: Array<number>;

        private _initializeNumber(value: number)
        {
            this._negative = value < 0;
            this._data = new Array<number>(1);
            this._data[0] = Math.abs(value);
            if (this._data[0] >= LongInt._helper.digitAbs)
                this._bcdNormalize();
        }

        private _initializeString(value: string)
        {
            if(!value.length)
                this._initializeNumber(0);
            if(value.length <= LongInt._helper.digitLength)
            {
                this._initializeNumber(parseInt(value));
            }
            else
            {
                let data: Array<number> = null;
                this._negative = LongInt._helper.isNegative(value);
                if (this._negative)
                    value = value.slice(1);
                for (let token of LongInt._helper.tokenize(value))
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
                    this._data = data.reverse();
            }
        }

        private _initialize(value?: ValueType)
        {
            let v_type = typeof(value);
            if (!value)
            {
                this._initializeNumber(0);
            }
            else if (v_type === "string")
            {
                this._initializeString(<string>value);
            }
            else if (v_type === "number")
            {
                this._initializeNumber(<number>value);
            }
            else if (value instanceof LongInt)
            {
                this._negative = value._negative;
                this._data = value._data.slice(0);
            }
            else
            {
                throw new Error("Unsupported value type " + typeof(value));
            }
        }

        private _absoluteGreater(value: LongInt, or_equal: boolean): boolean
        {
            let s = this.size();
            let same_size = s === value.size(); 
            if (same_size)
            {
                for (s--; s >= 0; s--)
                {
                    let ld = this._data[s];
                    let rd = value._data[s];
                    if (ld !== rd)
                    {
                        return ld > rd;   
                    }
                }
                return or_equal; //All digits equals
            }
            else
            {
                return s > value.size();
            }
        }

        private _absoluteLess(value: LongInt, or_equal: boolean): boolean
        {
            let s = this.size();
            let same_size = s === value.size(); 
            if (same_size)
            {
                for (s--; s >= 0; s--)
                {
                    let ld = this._data[s];
                    let rd = value._data[s];
                    if (ld !== rd)
                    {
                        return ld < rd;   
                    }
                }                
                return or_equal; //All digits equals
            }
            else
            {
                return s < value.size();
            }
        }
        
        private _bcdNormalize() : void
        {
            let d = this._data;
            for (let i = 0; i < d.length; i++)
            {
                let v = d[i];
                if (v >= LongInt._helper.digitAbs)
                {
                    let mod = v % LongInt._helper.digitAbs;
                    let quot = Math.floor(v / LongInt._helper.digitAbs);
                    d[i] = mod;
                    let j = i + 1;
                    if (j === d.length)
                    {
                        d.push(quot);
                    }
                    else
                    {
                        d[j] += quot;
                    }
                }
            }
        }

        private _absoluteAdd(value: LongInt): void
        {
            let s = this.size();
            let max_s = Math.max(s, value.size());
            for (let i = 0; i < s; i++)
            {
                if (s <= i)
                {
                    this._data.push(value._data[i]);
                }
                else
                {
                    this._data[i] += value._data[i];
                }
            }
            this._bcdNormalize();
        }

        private _absoluteSubLessOrEqualValue(value: LongInt): void
        {
            //! Value must be less or equal than this !
            let s = this.size() - 1;
            let vs = value.size();
            let slice_point = -1;
            for(let i = 0; i <= s; i++)
            {
                if (i < vs)
                {
                    this._data[i] -= value._data[i];
                }
                if (this._data[i] < 0)
                {
                    this._data[i] += LongInt._helper.digitAbs;
                    this._data[i + 1] -= 1;
                }
                if (this._data[i] === 0)
                {
                    slice_point = i;
                }
                else
                {
                    slice_point = -1;
                }
            }
            if (slice_point > 0)
            {
                 this._data = this._data.slice(0, slice_point);
            }
            else if(s === 0)
                this._initialize(0);
        }

        public constructor(readonly value?: ValueType)
        {
            this._initialize(value);
        }

        public readonly size = () => this._data.length;

        public readonly negative = () => this._negative;

        public assigned(value?: ValueType) : LongInt
        {
            this._initialize(value);
            return this;
        }

        public equal(value: LongInt): boolean
        {
            return this._negative === value._negative && 
                   this.size() === value.size() &&
                   this._data.every((d, i)=> d === value._data[i]);
        }

        public notequal(value: LongInt): boolean
        {
            return this._negative !== value._negative || 
                   this.size() !== value.size() &&
                   this._data.some((d, i)=> d !== value._data[i]);
        }

        public greater(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteLess(value, false) :
                       this._absoluteGreater(value, false);
            }
            else
            {
                return !value._negative;
            }
        }

        public greaterOrEqual(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteLess(value, true) :
                       this._absoluteGreater(value, true);
            }
            else
            {
                return !value._negative;
            }
        }

        public less(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteGreater(value, false) :
                       this._absoluteLess(value, false);
            }
            else
            {
                return this._negative;
            }
        }
        
        public lessOrEqual(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteGreater(value, true) :
                       this._absoluteLess(value, true);
            }
            else
            {
                return this._negative;
            }
        }

        public add(value: LongInt): LongInt
        {
            if (this._negative === value._negative)
            {
                this._absoluteAdd(value);            
                return this;
            }
            else
            {
                return this.sub(value);
            }
        }

        public sub(value: LongInt): LongInt
        {
            if (this._negative !== value._negative)
            {
                //(-x) - (+y) = -(x + y)
                //(+x) - (-y) = +(x + y)
                this._absoluteAdd(value);               
                return this; 
            }
            else if (this._negative) //both negative
            {
                //(-x) - (-y) = -x + y
                value = new LongInt(value);
                value._negative = false;
            }
            if (this.less(value))
            {
                let tmp_data = value._data;
                value = this;
                this._data = tmp_data;
                this._negative = true;
            }
            this._absoluteSubLessOrEqualValue(value);
        }

        public toString(): string
        {
            let ret: string = "";
            this._data.forEach((value, index, array)=>
            {
                let digit = value.toString();
                let zeros_count = LongInt._helper.digitLength - digit.length;
                if (zeros_count && index < (array.length - 1))
                {
                    ret = LongInt._helper.leadingZeros[zeros_count] + digit + ret;
                }
                else
                {
                    ret = digit + ret;
                }
            });
            return this._negative ? (LongInt._helper.negativeSign + ret) : ret;
        } 
    }
}

