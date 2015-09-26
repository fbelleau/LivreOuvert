define(["require", "exports"], function (require, exports) {
    var ComponentData = (function () {
        function ComponentData() {
        }
        Object.defineProperty(ComponentData.prototype, "ID", {
            get: function () { return this.mID; },
            set: function (aValue) { this.mID = aValue; },
            enumerable: true,
            configurable: true
        });
        ComponentData.prototype.FromJSON = function (aData) {
        };
        ComponentData.prototype.ToJSON = function () {
        };
        return ComponentData;
    })();
    return ComponentData;
});
