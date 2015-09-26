define(["require", "exports"], function (require, exports) {
    var Stop = (function () {
        function Stop() {
        }
        Object.defineProperty(Stop.prototype, "ID", {
            get: function () {
                return this.mID;
            },
            set: function (aValue) {
                this.mID = aValue;
            },
            enumerable: true,
            configurable: true
        });
        Stop.prototype.FromJSON = function (aData) {
            this.ID = aData.service_id;
        };
        return Stop;
    })();
    return Stop;
});
