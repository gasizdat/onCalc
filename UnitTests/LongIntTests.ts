/// <reference path="../LongRational.ts"/>
/// <reference path="../LongInt.ts"/>
/// <reference path="../Helpers.ts"/>

namespace Tests
{
    export class AnySignUnitTests extends UnitTestsBase
    {
        public constructor(negative: boolean)
        {
            super(negative);
        }

        public notequalOperatorTrue()
        {
            let ne = (x: string, y: string)=>
            {
                let lx = this.longInt(x);
                let ly = this.longInt(y);
                EXPECT_TRUE(lx.notequal(ly));
                EXPECT_TRUE(lx.notequal(ly));                
            };
            ne("1000", "1001");
            ne("100500", "100501");
            ne("7696969768565245576543344890987654", "100");
            ne("7696969768565245576543344890987654", "4325343543500040504504050054054032040324100");
            ne("314159265358", "504504050054054032040324100");
        }

        public notequalOperatorFalse()
        {
            let ne = (x: string, y: string)=>
            {
                let lx = this.longInt(x);
                let ly = this.longInt(y);
                EXPECT_FALSE(lx.notequal(ly));
                EXPECT_FALSE(lx.notequal(ly));                
            };
            ne("1000", "1000");
            ne("100500", "100500");
            ne("7696969768565245576543344890987654", "7696969768565245576543344890987654");
            ne("4325343543500040504504050054054032040324100", "4325343543500040504504050054054032040324100");
        }

        public numberToString(): void
        {
            let i = this.longInt(0);
            EXPECT_EQ(this.str("0"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_FALSE(i.negative()); //0 has no sign anyway
            i = this.longInt(100500);
            EXPECT_EQ(this.str("100500"), i.toString());
            EXPECT_EQ(1, i.size());
            EXPECT_EQ(this.negative(), i.negative());
            i = this.longInt(10000020000000);
            EXPECT_EQ(this.str("10000020000000"), i.toString());
            EXPECT_EQ(2, i.size());
            EXPECT_EQ(this.negative(), i.negative());
            i = this.longInt(9876543210123456);
            EXPECT_EQ(this.str("9876543210123456"), i.toString());
            EXPECT_EQ(3, i.size());
            EXPECT_EQ(this.negative(), i.negative());
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

        public equalOperatorTrue(): void
        {
            let eq = (x: onCalc.LongInt, y: onCalc.LongInt) =>
            {
                EXPECT_TRUE(x.equal(x));
                EXPECT_TRUE(y.equal(y));
                EXPECT_TRUE(y.equal(x));
                EXPECT_TRUE(x.equal(y));
            };
            eq(this.longInt(0), this.longInt(0));
            eq(this.longInt(10), this.longInt(10));
            eq(this.longInt(100500), this.longInt(100500));
            eq(this.longInt(99980000997766), this.longInt(99980000997766));
            eq(this.longInt("9999999000000009999997733"), this.longInt("9999999000000009999997733"));
            eq(this.longInt("9876543219876543210987654321123456789123456789123456789"), 
               this.longInt("9876543219876543210987654321123456789123456789123456789"));
        }

        public equalOperatorFalse(): void
        {
            let eq = (x: onCalc.LongInt, y: onCalc.LongInt) =>
            {
                EXPECT_FALSE(y.equal(x));
                EXPECT_FALSE(x.equal(y));
            };
            eq(this.longInt(1), this.longInt(0));
            eq(this.longInt(10), this.longInt(990010));
            eq(this.longInt(100501), this.longInt(100500));
            eq(this.longInt(99980000997766), this.longInt(99980000997767));
            eq(this.longInt("9999999000000009999997732"), this.longInt("9999999000000009999997733"));
            eq(this.longInt("9876543219876543210987654321123456789123456789123456789"), this.longInt(98));
            eq(this.longInt("98765432198765432109876543211234567891234567891234567890000000001"), 
               this.longInt("98765432198765432109876543211234567891234567891234567890000000000"));
        }

        public addOperator(): void
        {
            this.commutativeAdd
            (
                "1000000000000000000123456", 
                "100500",
                "1000000000000000000223956"
            );
            this.commutativeAdd
            (
                "999999999999999999999999999999999999999999", 
                "1",
                "1000000000000000000000000000000000000000000"
            );

            //988898223000005567789 * 2^100 = 1253577425950586507587511134287881576775643157233664
            let x = this.longInt("988898223000005567789");
            for(let i = 0; i < 100; i++)
            {
                x.add(x);
            }
            EXPECT_EQ(this.longInt("1253577425950586507587511134287881576775643157233664"), x);            
        }

        public mulOperator(): void
        {
            let commutative_mul = (x: string, y: string, z: string)=>
            {
                let lx = this.longInt(x);
                let ly = this.longInt(y);
                let lz = new onCalc.LongInt(z);
                EXPECT_EQ(lz, lx.mul(ly));                
                lx = this.longInt(x);
                EXPECT_EQ(lz, ly.mul(lx));
            };

            commutative_mul("123456",
                            "8765",
                            "1082091840");

            commutative_mul("650",
                            "12",
                            "7800");

            commutative_mul("1000000200000030",
                            "100000050",
                            "100000070000013000001500");

            commutative_mul("988898223000005567789",
                            "30240701240000002103230000000011",
                            "29904975718510066973724125918672588221311470061245679");

            //5433298776 ^ 20
            let x = this.longInt("5433298776");
            let y = this.longInt(1);
            super.stopWatchStart();
            for(let i = 0; i < 20; i++)
            {
                y.mul(x);
            }
            console.log("5433298776 to the 20th power at " + super.stopWatchStop().toString() + " ms");
            EXPECT_EQ(this.longInt("502657016439618253936552706323987501462044462964350" +
                                   "812061079995281026604246661831456686060326362690004" +
                                   "0919171814301248338843990986237094445425150910346005" + 
                                   "22312044753658643996655611309612781797376"), y);
        }
    }

    export class signRelatedUnitTests extends UnitTestsBase
    {
        public constructor()
        {
            super(false);
        }

        public equalOperatorFalse(): void
        {
            let eq = (x: string, y: string) =>
            {
                let lx = this.longInt(x);
                let ly = this.longInt(y);
                EXPECT_FALSE(ly.equal(lx));
                EXPECT_FALSE(lx.equal(ly));
                
                lx = this.longInt("-" + x);
                EXPECT_FALSE(ly.equal(lx));
                EXPECT_FALSE(lx.equal(ly));
                
                ly = this.longInt("-" + y);
                EXPECT_FALSE(ly.equal(lx));
                EXPECT_FALSE(lx.equal(ly));

                lx = this.longInt(x);
                ly = this.longInt("-" + y);
                EXPECT_FALSE(ly.equal(lx));
                EXPECT_FALSE(lx.equal(ly));
            };
            eq("1", "2");
            eq("100500", "100499");
            eq("10000000000000500000000000000", "100500");
            eq("9099990000500000000000000", "1059999999999988760");
            eq("9876543219876543210987654321123456789123456789123456789", "98");
            eq("98765432198765432109876543211234567891234567891234567890000000001", 
               "98765432198765432109876543211234567891234567891234567890000000000");
        }

        public notequalOperatorTrueNegAndPos()
        {
            let ne = (x: string, y: string)=>
            {
                let lx = this.longInt(x);
                let ly = this.longInt(y);
                EXPECT_TRUE(lx.notequal(ly));
                EXPECT_TRUE(lx.notequal(ly));                
            };
            ne("1000", "-1000");
            ne("-100500", "100501");
            ne("-7696969768565245576543344890987654", "100");
            ne("7696969768565245576543344890987654", "-100");
            ne("-696969768565245576543344890987654", "4325343543500040504504050054054032040324100");
            ne("314159265358", "-504504050054054032040324100");
        }

        public lessPosAndPos(): void
        {
            let x = this.longInt(0);
            let y = this.longInt(10);
            EXPECT_TRUE(x.less(y));
            EXPECT_FALSE(y.less(x));
            x = this.longInt("100");
            y = this.longInt("101");
            EXPECT_TRUE(x.less(y));
            EXPECT_FALSE(y.less(x));
            x = this.longInt("10099900087718376384324");
            y = this.longInt("10099900087718376384325");
            EXPECT_TRUE(x.less(y));
            EXPECT_FALSE(y.less(x));
            x = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987273");
            y = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987272");
            EXPECT_TRUE(y.less(x));
            EXPECT_FALSE(x.less(y));
            x = this.longInt("1020");
            EXPECT_TRUE(x.less(y));
            EXPECT_FALSE(y.less(x));
            x = this.longInt("9876543210987654321");
            y = this.longInt("9876543210987654321");
            EXPECT_FALSE(y.less(x));
            EXPECT_FALSE(x.less(y));
            x = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            y = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            EXPECT_FALSE(y.less(x));
            EXPECT_FALSE(x.less(y));            
        }

        public lessPosAndNeg(): void
        {
            let x = this.longInt("-100");
            let y = this.longInt("100");
            EXPECT_TRUE(x.less(y));
            EXPECT_FALSE(y.less(x));
            x = this.longInt("-876598765987657654309887665000019876555670000001");
            y = this.longInt("876598765987657654309887665000019876555670000001");
            EXPECT_TRUE(x.less(y));
            EXPECT_FALSE(y.less(x));
        }

        public lessNegAndNeg(): void
        {
            let x = this.longInt("-100");
            let y = this.longInt("-101");
            EXPECT_TRUE(y.less(x));
            EXPECT_FALSE(x.less(y));
            x = this.longInt("-10099900087718376384324");
            y = this.longInt("-10099900087718376384325");
            EXPECT_TRUE(y.less(x));
            EXPECT_FALSE(x.less(y));
            x = this.longInt("-876598765987657654309887665000019876555670000001");
            y = this.longInt("-876598765987657654309887665000019876555670000002");
            EXPECT_TRUE(y.less(x));
            EXPECT_FALSE(x.less(y));            
            x = this.longInt("-876598765987657654309887665000019876555670000002");
            y = this.longInt("-876598765987657654309887665000019876555670000002");
            EXPECT_FALSE(y.less(x));
            EXPECT_FALSE(x.less(y));
        }

        public lessOrEqualPosAndPos(): void
        {
            let x = this.longInt("0");
            let y = this.longInt("10");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_TRUE(y.lessOrEqual(x));
            y = this.longInt("666577655343538494836260000987360000000002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
        }

        public lessOrEqualPosAndNeg(): void
        {
            let x = this.longInt("-100");
            let y = this.longInt("10");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            y = this.longInt("600002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_FALSE(x.lessOrEqual(y));
            EXPECT_TRUE(y.lessOrEqual(x));
        }

        public lessOrEqualNegAndNeg(): void
        {
            let x = this.longInt("-100");
            let y = this.longInt("-10");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("-666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_TRUE(y.lessOrEqual(x));
            y = this.longInt("-600002");
            EXPECT_TRUE(x.lessOrEqual(y));
            EXPECT_FALSE(y.lessOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_FALSE(x.lessOrEqual(y));
            EXPECT_TRUE(y.lessOrEqual(x));
        }

        public greaterPosAndPos(): void
        {
            let x = this.longInt(10);
            let y = this.longInt(0);
            EXPECT_TRUE(x.greater(y));
            EXPECT_FALSE(y.greater(x));
            x = this.longInt("100500");
            y = this.longInt("101");
            EXPECT_TRUE(x.greater(y));
            EXPECT_FALSE(y.greater(x));
            x = this.longInt("10099900087718376384326");
            y = this.longInt("10099900087718376384325");
            EXPECT_TRUE(x.greater(y));
            EXPECT_FALSE(y.greater(x));
            x = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987273");
            y = this.longInt("626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987275");
            EXPECT_TRUE(y.greater(x));
            EXPECT_FALSE(x.greater(y));
            y = this.longInt("1020");
            EXPECT_TRUE(x.greater(y));
            EXPECT_FALSE(y.greater(x));
            x = this.longInt("9876543210987654321");
            y = this.longInt("9876543210987654321");
            EXPECT_FALSE(y.greater(x));
            EXPECT_FALSE(x.greater(y));
            x = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            y = this.longInt("9998100000005678894876598765987657654309887665000019876555670000002");
            EXPECT_FALSE(y.greater(x));
            EXPECT_FALSE(x.greater(y));            
        }
 
        public greaterPosAndNeg(): void
        {
            let x = this.longInt("100");
            let y = this.longInt("-100");
            EXPECT_TRUE(x.greater(y));
            EXPECT_FALSE(y.greater(x));
            x = this.longInt("678899987655443332000000000000000000000000000992");
            y = this.longInt("-678899987655443332000000000000000000000000000992");
            EXPECT_TRUE(x.greater(y));
            EXPECT_FALSE(y.greater(x));
        }
        
        public greateNegAndNeg(): void
        {
            let x = this.longInt("-100500");
            let y = this.longInt("-101");
            EXPECT_TRUE(y.greater(x));
            EXPECT_FALSE(x.greater(y));
            x = this.longInt("-10099900087718376384324");
            y = this.longInt("-125");
            EXPECT_TRUE(y.greater(x));
            EXPECT_FALSE(x.greater(y));
            x = this.longInt("-876598765987657654309887665000019876555670000001");
            y = this.longInt("-776598765987657654309887665000019876555670000001");
            EXPECT_TRUE(y.greater(x));
            EXPECT_FALSE(x.greater(y));            
            x = this.longInt("-876598765987657654309887665000019876555670000002");
            y = this.longInt("-876598765987657654309887665000019876555670000002");
            EXPECT_FALSE(y.greater(x));
            EXPECT_FALSE(x.greater(y));
        }
        
        public greateOrEqualPosAndPos(): void
        {
            let x = this.longInt("1005000");
            let y = this.longInt("10");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
            x = this.longInt("6665776553435380000000494836250000987360000000002");
            y = this.longInt("6665776553435380000000494836250000987360000000002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_TRUE(y.greaterOrEqual(x));
            y = this.longInt("6665776553435480000000494836250000987360000000002");
            EXPECT_FALSE(x.greaterOrEqual(y));
            EXPECT_TRUE(y.greaterOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_FALSE(x.greaterOrEqual(y));
            EXPECT_TRUE(y.greaterOrEqual(x));
        }

        public greaterOrEqualPosAndNeg(): void
        {
            let x = this.longInt("100");
            let y = this.longInt("-10");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("-666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
            x = this.longInt("600002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
            x = this.longInt("666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
        }

        public greaterOrEqualNegAndNeg(): void
        {
            let x = this.longInt("-100");
            let y = this.longInt("-1000");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
            x = this.longInt("-6888866577655343538494836250000987360000000002");
            y = this.longInt("-6888866577655343538494836250000987360000000002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_TRUE(y.greaterOrEqual(x));
            x = this.longInt("-600002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
            x = this.longInt("-666577655343538494836250000987360000000002");
            y = this.longInt("-824084208632000098432049000666577655343538494836250000987360000000002");
            EXPECT_TRUE(x.greaterOrEqual(y));
            EXPECT_FALSE(y.greaterOrEqual(x));
        }

        public fromReal(): void
        {
            let i = this.longInt(3.14159265358e300);
            EXPECT_TRUE(i.greaterOrEqual(this.longInt("3141592653580000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")));
            EXPECT_TRUE(i.lessOrEqual(this.longInt("3141592653590000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")));
            
            i = this.longInt(-3.14159265358e300);
            EXPECT_TRUE(i.greaterOrEqual(this.longInt("-3141592653590000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")));            
            EXPECT_TRUE(i.lessOrEqual(this.longInt("-3141592653580000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")));
        }

        public addOperatorPosAndNeg(): void
        {
            this.commutativeAdd
            (
                "100500", 
                "-100500", 
                "0"
            );
            this.commutativeAdd
            (
                "100000000000000000000500000000000000123", 
                "-100000000000000000000500000000000000123", 
                "0"
            );
            this.commutativeAdd
            (
                "98765432100000000001234567", 
                "-7748744000865746536452", 
                "98757683355999134254698115"
            );
            this.commutativeAdd
            (
                "8754740754354385747504875", 
                "-1009999292993838883488000200320350650075060887876700", 
                "-1009999292993838883488000191565609895720675140371825"
            );
            this.commutativeAdd
            (
                "5477376767648846862290000000000000568676323244565876544243546", 
                "-1234798763234567898700000000098766543", 
                "5477376767648846862289998765201237334108424544565876445477003"
            );

        }

        public factorialOperator(): void
        {
            let x = this.longInt("100").factorial();
            EXPECT_EQ
            (
                this.longInt("9332621544394415268169923885626670049071596826438162" + 
                             "1468592963895217599993229915608941463976156518286253" +
                             "697920827223758251185210916864000000000000000000000000"),
                x
            );

            EXPECT_THROW( ()=> this.longInt("-10").factorial());
        }

        public bisectionOperator(): void
        {
            let y = this.longInt(711);
            let x = this.longInt("2872173914587765773851034665705541980484469624770963643355584449871253725466883803132901275449098934085334808776933686482539875819499880612325959543345591162346069226018876027654298825065880330991499622611384005130599908431862830828883360634332069650572943775099726610686633307360712223739996219472139313013260136380006773932638377134155926113855342645139626872911664977973044952876964410420104232440803741249018237780478297572656553458660808779753878625376108402675310795228674146139323337415981021373367680471855864028977213007224872753971404799162861243196437639786628281112852679786015122170702276489682921614999552");
            let i = 0;
            super.stopWatchStart();
            for(; x.notequal(y) && i < 2050; i++)
            {
                x.bisect();
            }
            console.log(`2045 bisections at ${super.stopWatchStop()} ms`);
            EXPECT_EQ(2045, i)

        }

        public gcdOperator(): void
        {
            let x = this.longInt(80000000000000000000);
            let y = this.longInt(40000);
            let gcd = onCalc.LongInt.gcd(x, y);
            EXPECT_EQ(this.longInt(40000), gcd);
        }
    }
}

