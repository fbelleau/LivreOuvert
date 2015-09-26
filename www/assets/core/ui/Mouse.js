define(["require", "exports", "../geom/Point"], function (require, exports, Point) {
    var Mouse = (function () {
        function Mouse() {
        }
        Mouse.GetX = function () {
            return (this.mPosition.X);
        };
        Mouse.GetY = function () {
            return (this.mPosition.Y);
        };
        Mouse.GetPosition = function () {
            return (this.mPosition);
        };
        Mouse.OnMouseMove = function (aEvent) {
            Mouse.mPosition.X = aEvent.clientX || aEvent.pageX;
            Mouse.mPosition.Y = aEvent.clientY || aEvent.pageY;
        };
        Mouse.Start = function () {
            document.addEventListener("mousemove", Mouse.OnMouseMove);
        };
        Mouse.Stop = function () {
            document.removeEventListener("mousemove", Mouse.OnMouseMove);
        };
        Mouse.mPosition = new Point(0, 0);
        return Mouse;
    })();
    return Mouse;
});
