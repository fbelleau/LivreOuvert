define(["require", "exports"], function (require, exports) {
    var Logger = (function () {
        function Logger() {
        }
        Logger.Log = function (aMessage, aType, aDiv) {
            if (aType === void 0) { aType = 'INFO'; }
            if (aDiv === void 0) { aDiv = "output"; }
            var output = document.getElementById(aDiv);
            output.innerText += "\n " + aType + ": " + aMessage;
        };
        return Logger;
    })();
    return Logger;
});
