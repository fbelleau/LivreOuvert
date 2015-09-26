var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../core/mvc/AbstractView", "./event/HomeEvent"], function (require, exports, AbstractView, HomeEvent) {
    var BusView = (function (_super) {
        __extends(BusView, _super);
        function BusView() {
            _super.call(this);
        }
        BusView.prototype.RenderTemplate = function (aAttributes) {
            if (aAttributes === void 0) { aAttributes = {}; }
            _super.prototype.RenderTemplate.call(this, aAttributes);
            this.TemplateDiv.style.height = "60px";
            this.TemplateDiv.style.overflowY = "hidden";
            this.TemplateDiv.style.transition = "all 0.5s";
            this.TemplateDiv.style.transform = "translate3d(0, 0, 0)";
            return (this.TemplateDiv);
        };
        BusView.prototype.OnTransitionEnded = function (aEvent) {
            this.DispatchEvent(new HomeEvent(HomeEvent.TRANSITION_ENDED));
        };
        Object.defineProperty(BusView.prototype, "IsDrawerOpened", {
            get: function () {
                return this.mDrawerOpened;
            },
            enumerable: true,
            configurable: true
        });
        BusView.prototype.GetRGBFromStyle = function (aDiv) {
            var backgroundRGB = aDiv.style.backgroundColor.split(", ");
            backgroundRGB[0] = backgroundRGB[0].split("rgb(")[1];
            backgroundRGB[1] = backgroundRGB[1];
            backgroundRGB[2] = backgroundRGB[2].split(")")[0];
            var red = Number(backgroundRGB[0]);
            var green = Number(backgroundRGB[1]);
            var blue = Number(backgroundRGB[2]);
            return ([red, green, blue]);
        };
        BusView.prototype.CloseBusDrawer = function () {
            this.mDrawerOpened = false;
        };
        BusView.prototype.OpenBusDrawer = function () {
            this.mDrawerOpened = true;
        };
        return BusView;
    })(AbstractView);
    return BusView;
});
