var onCalc;
(function (onCalc) {
    var Core = (function () {
        function Core(pack_dir, async) {
            this.pack_dir = pack_dir;
            Core.emplaceScript(pack_dir + "/" + "Helpers.js", async);
            Core.emplaceScript(pack_dir + "/" + "LongInt.js", async);
            Core.emplaceScript(pack_dir + "/" + "Interfaces.js", async);
            Core.emplaceScript(pack_dir + "/" + "UnitTests.js", async);
        }
        Core.emplaceScript = function (name, async) {
            var script = document.createElement('script');
            script.src = name;
            script.type = "text/javascript";
            script.async = async;
            console.log("onCalc part " + name + " loading...");
            script.onload = function () {
                console.log("onCalc part " + name + " loaded!");
            };
            document.head.appendChild(script);
        };
        return Core;
    }());
    onCalc.Core = Core;
    function bootstrapperAsync(pack_dir) {
        if (pack_dir === void 0) { pack_dir = "./Generated"; }
        new onCalc.Core(pack_dir, true);
    }
    onCalc.bootstrapperAsync = bootstrapperAsync;
})(onCalc || (onCalc = {}));
onCalc.bootstrapperAsync();
//# sourceMappingURL=Core.js.map