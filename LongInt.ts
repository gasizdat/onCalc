function testLongInt()
{
    let i1 = new onCalc.LongInt(100);
    let i2 = new onCalc.LongInt("100500");
} 

namespace onCalc
{
    class Limiter
    {
        constructor()
        {
            for(let i: number = 32;; i++)
            {
                let value = Math.pow(2, i);
                let str_value = value.toFixed();
                if(str_value.toLowerCase().indexOf('e') !== -1)
                {
                    break;
                }
                else
                {
                    this.maxStoredNumber = value;
                    this.digitsInNumber = str_value.length;
                }
            }
        }
        public maxStoredNumber: number;
        public digitsInNumber: number;
    }
    
    const _limits: Limiter = new Limiter();
    type ValueType = string | number;
    export class LongInt
    {
        private _sign: boolean;
        private _data: Array<number>;

        private _initializeNumber(value: number)
        {
            this._sign = value < 0;
            this._data = new Array<number>(1);
            this._data[0] = Math.abs(value);
        }
        private _initializeString(value: string)
        {
            if(!value.length)
                this._initializeNumber(0);
            this._sign = value.charAt(0) !== '-';
/*
            this._data.push(Math.abs(value));*/
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
    }
}