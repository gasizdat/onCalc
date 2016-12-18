module onCalc
{    
    export interface Numeric<T>
    {
        equal(value: T): boolean;
        notequal(value: T): boolean;
        less(value: T): boolean;
        greater(value: T): boolean;
        lessOrEqual(value: T): boolean;
        greaterOrEqual(value: T): boolean;
        negative(): boolean;
        add(value: T): T;
        sub(value: T): T;
        toString(): string;
    }
}