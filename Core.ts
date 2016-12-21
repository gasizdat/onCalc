namespace onCalc
{
    export class Core
    {
        private static emplaceScript(name: string, async: boolean): void
        {
            let script = document.createElement('script');
            script.src = name;
            script.type = "text/javascript";
            script.async = async;
            console.log("onCalc part " + name + " loading...");
            if (async)
            {
                script.onload = ()=>
                {
                    console.log("onCalc part " + name + " loaded!");
                };
            }
            document.head.appendChild(script);
        }
        constructor(readonly pack_dir: string, async: boolean)
        {
            Core.emplaceScript(pack_dir + "/" + "Helpers.js", async);
            Core.emplaceScript(pack_dir + "/" + "LongInt.js", async);
            Core.emplaceScript(pack_dir + "/" + "Interfaces.js", async);
            Core.emplaceScript(pack_dir + "/" + "UnitTests.js", async);
        }
    }

    export function bootstrapperAsync(pack_dir: string = "./Generated")
    {
        new onCalc.Core(pack_dir, true);
    }
}

onCalc.bootstrapperAsync();