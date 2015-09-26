var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../event/EventDispatcher", "../net/LazyLoader", "./event/MVCEvent"], function (require, exports, EventDispatcher, LazyLoader, MVCEvent) {
    var AbstractModel = (function (_super) {
        __extends(AbstractModel, _super);
        function AbstractModel() {
            this.mDataCache = {};
            _super.call(this);
        }
        AbstractModel.prototype.Fetch = function (aURL, aForceRefresh) {
            var _this = this;
            if (aForceRefresh === void 0) { aForceRefresh = false; }
            if (!aForceRefresh && this.mDataCache[aURL] != null) {
                this.OnJSONLoadSuccess(this.mDataCache[aURL], aURL);
                return;
            }
            var promise = LazyLoader.loadJSON(aURL);
            promise.then(function () { return _this.OnJSONLoadSuccess(promise.result, aURL); });
            promise.fail(function () { return _this.OnJSONLoadError(aURL); });
        };
        AbstractModel.prototype.GetData = function (aURL) {
            return this.mDataCache[aURL];
        };
        AbstractModel.prototype.OnJSONLoadError = function (aURL) {
            console.log("There was an error loading, ", aURL);
        };
        AbstractModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
            this.mDataCache[aURL] = aJSONData;
            this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
        };
        return AbstractModel;
    })(EventDispatcher);
    return AbstractModel;
});
