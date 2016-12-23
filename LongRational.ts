/// <reference path="Helpers.ts"/>
/// <reference path="Interfaces.ts"/>
/// <reference path="LongInt.ts"/>

namespace onCalc
{    
    //The rational number with "unlimited" long nomitator and denominator.
    //Remarks: doesn't use get/set accessors for ECMAScript-3 compliance.
    export class LongRational //implements Rational
    {
        private static readonly _helper = LongHelper.instance();
        private _nominator: LongInt;
        private _denominator: LongInt;
        
        private _initializeNumber(value: number): void
        {
            if (value !== Math.floor(value))
            {
                console.log(LongRational._helper.decimalSeparators.toString());
            }
            else
            {
                this._nominator = new LongInt(value);
                this._denominator = new LongInt(LongInt.one);
            }
        }

        private _initializeString(value: string): void
        {
            console.log(value);
        }

        private _initializeLongInt(value: LongInt): void
        {
            this._nominator = new LongInt(value);
            this._denominator = new LongInt(LongInt.one);
        }

        private _initializeLongRational(value: LongRational): void
        {
            this._nominator = new LongInt(value._nominator);
            this._denominator = new LongInt(value._denominator);
        }

        private _initialize(value: LongRationalValueType)
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
                this._initializeLongInt(value);
            }
            else if(value instanceof LongRational)
            {
                this._initializeLongRational(value);
            }
            else
            {
                throw new Error("Unsupported value type " + typeof(value));
            }
        }

        constructor(readonly value: LongRationalValueType)
        {
            this._initialize(value);
        }
    }
}