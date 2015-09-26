/**
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
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComponentData) {
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task() {
            _super.call(this);
            this.mRisk = 0;
            this.mQuantity = 0;
            this.mHourList = new Array();
        }
        Task.prototype.Destroy = function () {
            this.mHourList.length = 0;
            this.mHourList = null;
        };
        Object.defineProperty(Task.prototype, "FeatureID", {
            get: function () { return this.mFeatureID; },
            set: function (aValue) { this.mFeatureID = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Description", {
            get: function () { return this.mDescription; },
            set: function (aValue) { this.mDescription = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Evaluate", {
            get: function () { return this.mEvaluate; },
            set: function (aValue) { this.mEvaluate = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Risk", {
            get: function () { return this.mRisk; },
            set: function (aValue) { this.mRisk = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "Quantity", {
            get: function () { return this.mQuantity; },
            set: function (aValue) { this.mQuantity = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "HourList", {
            get: function () { return this.mHourList; },
            enumerable: true,
            configurable: true
        });
        return Task;
    })(ComponentData);
    return Task;
});
