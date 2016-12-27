/// <reference path="Helpers.ts"/>
/// <reference path="Interfaces.ts"/>
/// <reference path="LongRational.ts"/>

namespace onCalc
{    
    //The BCD-like "unlimited" long integer number
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    export class LongInt implements Numeric
    {
        private static readonly _helper = LongHelper.instance();
        private _negative: boolean;
        private _data: Array<number>;

        private static _absoluteSubFromGreate(x: LongInt, y: LongInt): void
        {
            let s = x.size() - 1;
            let vs = y.size();
            let slice_point = -1;
            for(let i = 0; i <= s; i++)
            {
                if (i < vs)
                {
                    x._data[i] -= y._data[i];
                }
                if (x._data[i] < 0)
                {
                    x._data[i] += LongInt._helper.digitAbs;
                    x._data[i + 1] -= 1;
                }
                if (x._data[i] === 0)
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
                x._data = x._data.slice(0, slice_point);
            }
        }

        private _initializeNumber(value: number)
        {
            if (!isFinite(value))
                throw EvalError("Initialize value is infinite or NaN");
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

        private _initialize(value?: LongIntValueType)
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
                throw new Error(`Unsupported value type ${value}`);
            }
        }

        private _absoluteComparison(value: LongInt): number
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
                        return (ld - rd);   
                    }
                }
                return 0; //All digits equals
            }
            else
            {
                return s - value.size();
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
            let sv = value.size();
            let min_s = Math.min(s, sv);
            let i = 0;
            for (; i < min_s; i++)
            {
                this._data[i] += value._data[i];
            }
            if (i < sv)
            {
                //TODO Doesn't work properly, understand why.
                //this._data.push.apply(value._data.slice(i));
                this._data = this._data.concat(value._data.slice(i));
            }
            this._bcdNormalize();
        }

        private _absoluteSub(value: LongInt): void
        {            
            let comp = this._absoluteComparison(value);
            if (comp == 0)
            {
                this._initialize(0);
            }
            else
            {
                if (comp < 0)
                {
                    //copy value data and swap with this
                    let tmp_data = value._data;
                    value = new LongInt();
                    value._data = this._data;
                    this._data = tmp_data.slice(0);
                    this._negative = true;
                }

                LongInt._absoluteSubFromGreate(this, value);
            }
        }

        /** Fastest multiplication by LongHelper.digitAbs ^ digits, complexity O(digits) 
         *  @param digits A exponent of 10. */
        private _absoluteShiftUp(digits: number): void
        {
            while(digits--)
            {
                this._data.unshift(0);
            }
        }

        /** Fastest division by LongHelper.digitAbs ^ digits, complexity O(digits) */
        /*private _absoluteShiftDown(digits: number): void
        {
            while(digits--)
            {
                this._data.shift();
            }
        }*/

        private static _gcd(x: LongInt, y: LongInt): LongInt
        {
/*
            Very slow algorithm. O(N*log(N)), where N = [x - y]
            while(x.notequal(y))
            {
                if (x.greater(y))
                    LongInt._absoluteSubFromGreate(x, y);
                else
                    LongInt._absoluteSubFromGreate(y, x);
            }
            return x;
*/
            if (x.equal(y))
            {
                return x;
            }
            else if(x.equal(LongInt.one) || y.equal(LongInt.one))
            {
                return LongInt.one;
            }
            else
            {
                let x_even = x.isEven();
                let y_even = y.isEven();
                if (x_even)
                {
                    if (!y_even)
                    {
                        return LongInt.gcd(x.bisect(), y); //x - even, y - odd
                    }
                    else
                    {
                        return LongInt.gcd(x.bisect(), y.bisect()).mul(LongInt.two); //x- even, y - even
                    }
                }
                else if (y_even)
                {
                    return LongInt.gcd(x, y.bisect());//x - odd, y - even
                }
                else if(x.greater(y)) //x - odd, y - odd, x > y
                {
                    LongInt._absoluteSubFromGreate(x, y);
                    return LongInt.gcd(x.bisect(), y);
                }
                else  //x - odd, y - odd, x < y
                {
                    LongInt._absoluteSubFromGreate(y, x);
                    return LongInt.gcd(y.bisect(), x);
                }
            }
        }

        private _divNumber(value: number): LongInt
        {
            let result = new Array<number>();
            let carriage: number = 0;
            for (let i = (this.size() - 1); i >= 0; i--)
            {
                let n = carriage * LongInt._helper.digitAbs + this._data[i];
                if (n > value)
                {
                    result.push(Math.floor(n / value));
                    carriage = n % value;
                }
                else
                {
                    if (result.length)
                        result.push(0);
                    carriage = n;
                }
            }           
            this._data = result.reverse();
            return this;
        }

        public constructor(readonly value?: LongIntValueType)
        {
            this._initialize(value);
        }

        public readonly size = () => this._data.length;

        public readonly negative = () => this._negative;

        public assigned(value?: LongIntValueType) : LongInt
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
                   this.size() !== value.size() ||
                   this._data.some((d, i)=> d !== value._data[i]);
        }

        public greater(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteComparison(value) < 0 :
                       this._absoluteComparison(value) > 0;
            }
            else
            {
                return value._negative;
            }
        }

        public greaterOrEqual(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteComparison(value) <= 0 :
                       this._absoluteComparison(value) >= 0;
            }
            else
            {
                return value._negative;
            }
        }

        public less(value: LongInt): boolean
        {
            if (this._negative === value._negative)
            {
                return this._negative ? 
                       this._absoluteComparison(value) > 0 :
                       this._absoluteComparison(value) < 0;
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
                       this._absoluteComparison(value) >= 0 :
                       this._absoluteComparison(value) <= 0;
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
                //(+x) + (+y) = +(x + y)
                //(-x) + (-y) = -(x + y)
                this._absoluteAdd(value);            
            }
            else if(!this._negative)
            {
                //(+x) + (-y) = x - y
                this._absoluteSub(value);
            }
            else
            {
                //(-x) + (+y) = (+y) - (+x)
                this._negative = false;
                value = new LongInt(value);
                value._absoluteSub(this);
                this._data = value._data;
                this._negative = value._negative;
            }
            return this;
        }

        public sub(value: LongInt): LongInt
        {
            if (this._negative !== value._negative)
            {
                //(-x) - (+y) = -(x + y)
                //(+x) - (-y) = +(x + y)
                this._absoluteAdd(value);               
            }
            else if (this._negative) //both negative
            {
                //(-x) - (-y) = y - x
                this._negative = false;
                value = new LongInt(value);
                value._negative = false;
                value.sub(this);
                this._data = value._data;
                this._negative = value._negative;
            }
            else //both positive
            {
                this._absoluteSub(value);
            }
            return this;
        }

        public mul(value: LongInt): LongInt
        {
            let result = new onCalc.LongInt();
            let temp_result = new onCalc.LongInt();
            this._data.forEach((x: number, i: number)=>
            {
                temp_result._data = new Array<number>(value.size());
                value._data.forEach((y: number, j: number)=>
                {
                    temp_result._data[j] = x * y;
                });
                temp_result._absoluteShiftUp(i);
                result._absoluteAdd(temp_result);
            });
            this._data = result._data;
            this._negative = this._negative !== value._negative;
            return this;
        }

        /** Fastest division by 2 (bisection), complexity O(size()) */
        public bisect(): LongInt
        {
            let half_rank = LongInt._helper.digitAbs / 2;
            this._data.forEach((v: number, i: number, a: Array<number>)=>
            {
                if (i > 0 && (v % 2) !== 0)
                {
                    a[i - 1] += half_rank;
                }
                if (v === 1 && i === (a.length - 1))
                {
                    this._data.pop();
                }
                else
                {
                    a[i] = Math.floor(v / 2);
                }
            });
            return this;
        }

        public div(value: LongInt): LongInt
        {
            let c = this._absoluteComparison(value);
            if (c > 0)
            {
                if (value.size() === 1)
                    this._divNumber(value._data[0]);
            }
            else if (c === 0) //this == value
            {
                this._initialize(LongInt.one);
            }
            else //this < value
            {
                this._initialize(LongInt.zero);
            }
            this._negative = this._negative !== value._negative;
            return this;
        }

        public factorial(): LongInt
        {
            if (this._negative)
                throw new EvalError("factorial(n) determined for natural numbers only!");
            let result = new LongInt(LongInt.one);
            while (this.greater(LongInt.zero))
            {
                result.mul(this);
                this.decrement();
            }
            this._data = result._data;
            return this;
        }

        public increment(): any
        {
            return this.add(LongInt.one);
        }

        public decrement(): any
        {
            return this.sub(LongInt.one);
        }

        public negate(): boolean
        {
            this._negative = !this._negative;
            return this._negative;
        }

        public toString(): string
        {
            let ret: string = "";
            //TS bug value, index, array - implicit any, but fine compiling
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

        public isOdd(): boolean
        {
            return (this._data[0] % 2) !== 0;
        }

        public isEven(): boolean
        {
            return (this._data[0] % 2) === 0;
        }

        public static gcd(x: LongInt, y: LongInt): LongInt
        {
            return LongInt._gcd(new LongInt(x), new LongInt(y));
        }

        public static readonly zero = new LongInt(0);
        public static readonly one = new LongInt(1);
        public static readonly two = new LongInt(2);
    }
}

