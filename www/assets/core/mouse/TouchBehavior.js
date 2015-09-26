var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../event/EventDispatcher", "./event/MouseTouchEvent", "../geom/Point"], function (require, exports, EventDispatcher, MouseTouchEvent, Point) {
    var AbstractView = (function (_super) {
        __extends(AbstractView, _super);
        function AbstractView() {
            _super.call(this);
            this.mElementList = new Array();
            this.mMousePosition = new Point();
        }
        AbstractView.prototype.Destroy = function () {
            for (var i = 0; i < this.mElementList.length; i++) {
                this.RemoveClickControl(this.mElementList[i]);
            }
            this.mElementList.length = 0;
            this.mElementList = null;
            this.mLastTouchEvent = null;
            this.mMousePosition = null;
        };
        AbstractView.prototype.AddClickControl = function (aElement) {
            this.mElementList.push(aElement);
            aElement.addEventListener("touchstart", this.OnTouchStart.bind(this));
            aElement.addEventListener("touchmove", this.OnTouchMove.bind(this));
            aElement.addEventListener("touchend", this.OnTouchEnd.bind(this));
            aElement.addEventListener("mousedown", this.OnMouseDown.bind(this));
            aElement.addEventListener("mouseup", this.OnMouseUp.bind(this));
        };
        AbstractView.prototype.RemoveClickControl = function (aElement) {
            var elementIndex = this.mElementList.indexOf(aElement);
            var element = this.mElementList[elementIndex];
            element.removeEventListener("touchstart", this.OnTouchStart.bind(this));
            element.removeEventListener("touchmove", this.OnTouchMove.bind(this));
            element.removeEventListener("touchend", this.OnTouchEnd.bind(this));
            element.removeEventListener("mousedown", this.OnMouseDown.bind(this));
            element.removeEventListener("mouseup", this.OnMouseUp.bind(this));
            this.mElementList.splice(elementIndex, 1);
        };
        AbstractView.prototype.OnMouseDown = function (aEvent) {
        };
        AbstractView.prototype.OnMouseUp = function (aEvent) {
            var touchEvent = new MouseTouchEvent(MouseTouchEvent.TOUCHED);
            touchEvent.target = aEvent.target;
            touchEvent.currentTarget = aEvent.currentTarget;
            this.DispatchEvent(touchEvent);
        };
        AbstractView.prototype.OnTouchStart = function (aEvent) {
            this.mLastTouchEvent = aEvent;
            this.mTouchTarget = aEvent.target;
            var firstTouch = aEvent.targetTouches.item(0);
            this.mMousePosition.X = firstTouch.clientX || firstTouch.pageX;
            this.mMousePosition.Y = firstTouch.clientY || firstTouch.pageY;
        };
        AbstractView.prototype.OnTouchMove = function (aEvent) {
            this.mLastTouchEvent = aEvent;
        };
        AbstractView.prototype.OnTouchEnd = function (aEvent) {
            var endTouch = this.mLastTouchEvent.targetTouches.item(0);
            var endTouchX = endTouch.clientX || endTouch.pageX;
            var endTouchY = endTouch.clientY || endTouch.pageY;
            if (this.mTouchTarget === this.mLastTouchEvent.target &&
                this.mMousePosition.X === endTouchX &&
                this.mMousePosition.Y === endTouchY) {
                var touchEvent = new MouseTouchEvent(MouseTouchEvent.TOUCHED);
                touchEvent.target = aEvent.target;
                touchEvent.currentTarget = aEvent.currentTarget;
                this.DispatchEvent(touchEvent);
            }
        };
        return AbstractView;
    })(EventDispatcher);
    return AbstractView;
});
