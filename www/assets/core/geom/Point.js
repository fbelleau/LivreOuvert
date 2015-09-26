/***
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright Cortex Media 2015
 *
 * @author Mathieu 'Sanchez' Cote
 */
define(["require", "exports"], function (require, exports) {
    var Point = (function () {
        function Point(aX, aY) {
            if (aX === void 0) { aX = 0; }
            if (aY === void 0) { aY = 0; }
            this.mX = aX;
            this.mY = aY;
        }
        Point.prototype.Clone = function () {
            return (new Point(this.mX, this.mY));
        };
        Object.defineProperty(Point.prototype, "X", {
            get: function () { return (this.mX); },
            set: function (aValue) { this.mX = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () { return (this.mY); },
            set: function (aValue) { this.mY = aValue; },
            enumerable: true,
            configurable: true
        });
        Point.prototype.Add = function (aPoint) {
            this.mX += aPoint.X;
            this.mY += aPoint.Y;
            return this;
        };
        Point.prototype.Subtract = function (aPoint) {
            this.mX -= aPoint.X;
            this.mY -= aPoint.Y;
            return this;
        };
        Point.prototype.Multiply = function (aValue) {
            this.mX *= aValue;
            this.mY *= aValue;
            return this;
        };
        Point.prototype.Invert = function () {
            this.mX *= -1;
            this.mY *= -1;
            return this;
        };
        Point.prototype.IsEqual = function (aPoint) {
            return this.mX === aPoint.X && this.mY === aPoint.Y;
        };
        Point.prototype.toString = function () {
            return (this.mX + ", " + this.mY);
        };
        return Point;
    })();
    return Point;
});
