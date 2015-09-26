var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../event/EventDispatcher"], function (require, exports, EventDispatcher) {
    var AbstractController = (function (_super) {
        __extends(AbstractController, _super);
        function AbstractController() {
            _super.call(this);
        }
        AbstractController.prototype.Init = function (aActions) {
        };
        AbstractController.prototype.Destroy = function () {
        };
        return AbstractController;
    })(EventDispatcher);
    return AbstractController;
});
