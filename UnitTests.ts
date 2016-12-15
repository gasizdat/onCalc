/// <reference path="LongInt.ts"/>

module Tests
{
    export class UnitTests
    {
        private static EXPECT_EQ<T>(expected: string|onCalc.LongInt, actual: string|onCalc.LongInt): void
        {
            let assert: boolean;
            if (typeof(expected) === "string")
            {
                assert = <string>expected === <string>actual;
            }
            else
            {
                assert = expected.equal(<onCalc.LongInt>actual);
            }
            if(!assert)
            {
                throw new EvalError("Expected: " + expected.toString() + ". Actual: " + actual.toString());
            }
        }
        private static Add(): void
        {
            //99009900990099009900 + 998877665544332211 = 100008778655643342111
            let result = new onCalc.LongInt("99009900990099009900").add(new onCalc.LongInt("998877665544332211"));
            UnitTests.EXPECT_EQ(new onCalc.LongInt("100008778655643342111"), result);
            UnitTests.EXPECT_EQ("100008778655643342111", result.toString());
        }

        public static RunAllTests(): void
        {
            try
            {
                UnitTests.Add();
                alert("ALL TESTS PASSED");
            }
            catch(ex)
            {
                alert("Test failed with message: " + ex.toString());
            }
        }
    }
    UnitTests.RunAllTests();
}

