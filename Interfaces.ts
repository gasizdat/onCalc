declare namespace onCalc
{    
    export type LongIntValueType = string | number | LongInt;
    export type LongRationalValueType = LongIntValueType | LongRational;

    export interface Numeric
    {
        equal(value: any): boolean;
        notequal(value: any): boolean;
        less(value: any): boolean;
        lessOrEqual(value: any): boolean;
        greater(value: any): boolean;
        greaterOrEqual(value: any): boolean;
        negate(): boolean;
        negative(): boolean;
        add(value: any): any;
        sub(value: any): any;
        mul(value: any): any;
        div(value: any): any;
        factorial(): any;
        increment(): any;
        decrement(): any;
        toString(): string;
    }

    export interface Rational extends Numeric
    {
        numerator(): any;
        denominator(): any;
    }
}