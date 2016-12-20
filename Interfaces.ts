declare namespace onCalc
{    
    export interface Numeric
    {
        equal(value: any): boolean;
        notequal(value: any): boolean;
        less(value: any): boolean;
        greater(value: any): boolean;
        lessOrEqual(value: any): boolean;
        greaterOrEqual(value: any): boolean;
        negative(): boolean;
        add(value: any): any;
        sub(value: any): any;
        mul(value: any): any;
        toString(): string;
    }

    export interface Rational extends Numeric
    {
        numerator(): any;
        denominator(): any;

        div(value: any): any;
    }
}