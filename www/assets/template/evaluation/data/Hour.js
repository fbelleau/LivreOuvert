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
    var Hour = (function (_super) {
        __extends(Hour, _super);
        function Hour(aDepartmentID, aExecutionTime) {
            _super.call(this);
            this.mDepartmentID = aDepartmentID;
            this.mExecutionTime = aExecutionTime;
        }
        Object.defineProperty(Hour.prototype, "DepartmentID", {
            get: function () { return this.mDepartmentID; },
            set: function (aValue) { this.mDepartmentID = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hour.prototype, "ExecutionTime", {
            get: function () { return this.mExecutionTime; },
            set: function (aValue) { this.mExecutionTime = aValue; },
            enumerable: true,
            configurable: true
        });
        return Hour;
    })(ComponentData);
    return Hour;
});
