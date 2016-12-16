/// <reference path="LongInt.ts"/>

module Tests
{
    function EXPECT_EQ<T>(expected: string|onCalc.LongInt|number|boolean, actual: string|onCalc.LongInt|number|boolean): void
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
            throw new EvalError("Expected: " + expected.toString() + ". Actual: " + actual.toString());
        }
    }
    
    class AnySignUnitTests
    {
        private readonly _negative: boolean;
        constructor(negative: boolean)
        {
            this._negative = negative;
        }

        public longInt(value: number | string): onCalc.LongInt
        {
            switch(typeof(value))
            {
                case "string":
                    return new onCalc.LongInt(this._negative ? "-" + value : value);
                case "number":
                    return new onCalc.LongInt(this._negative ? -value : value);
                default:
                    throw new Error("Initialize value type not supported");
            }
        }

        public str(value: string): string
        {
            return ((this._negative && value !== "0") ? ("-" + value) : value);
        }
 
        public numberToString(): void
        {
            let i = this.longInt(0);
            EXPECT_EQ(this.str("0"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(false, i.negative()); //0 has no sign anyway
            i = this.longInt(100500);
            EXPECT_EQ(this.str("100500"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(this._negative, i.negative());
            i = this.longInt(10000020000000);
            EXPECT_EQ(this.str("10000020000000"), i.toString());
            EXPECT_EQ(2, i.size());
            EXPECT_EQ(this._negative, i.negative());
            i = this.longInt(9876543210123456);
            EXPECT_EQ(this.str("9876543210123456"), i.toString());
            EXPECT_EQ(3, i.size());
            EXPECT_EQ(this._negative, i.negative());
        }

        public equalNumberAndStringConstruction(): void
        {
            let x = this.longInt(0);
            let y = this.longInt("0");
            EXPECT_EQ(x, y);
            x = this.longInt(100);
            y = this.longInt("100");
            EXPECT_EQ(x, y);
            x = this.longInt(100500);
            y = this.longInt("100500");
            EXPECT_EQ(x, y);
            x = this.longInt(10000000);
            y = this.longInt("10000000");
            EXPECT_EQ(x, y);
            x = this.longInt(10000000000);
            y = this.longInt("10000000000");
            EXPECT_EQ(x, y);
            x = this.longInt(12345670009900);
            y = this.longInt("12345670009900");
            EXPECT_EQ(x, y);
            x = this.longInt(31415926535897932);
            y = this.longInt("31415926535897932");
            EXPECT_EQ(x, y);
        } 

        private add(): void
        {
            //99009900990099009900 + 998877665544332211 = 100008778655643342111
            let result = new onCalc.LongInt("99009900990099009900").add(new onCalc.LongInt("998877665544332211"));
            EXPECT_EQ("100008778655643342111", result.toString());
        }
    }
    function RunAllTests(): void
    {
        try
        {
            let positive = new AnySignUnitTests(false);
            positive.numberToString();
            positive.equalNumberAndStringConstruction();

            let negative = new AnySignUnitTests(true);
            negative.numberToString();
            negative.equalNumberAndStringConstruction();

            alert("ALL TESTS PASSED");
        }
        catch(ex)
        {
            alert("Test failed with message: " + ex.toString());
        }
    }
    RunAllTests();
}

