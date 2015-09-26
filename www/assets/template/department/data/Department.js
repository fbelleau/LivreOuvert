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
define(["require", "exports", "../../../core/component/data/ComponentData"], function (require, exports, ComportentData) {
    var Department = (function (_super) {
        __extends(Department, _super);
        function Department() {
            _super.call(this);
            this.mUserList = new Array();
        }
        Object.defineProperty(Department.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Department.prototype, "HourlyRate", {
            get: function () { return this.mHourlyRate; },
            set: function (aValue) { this.mHourlyRate = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Department.prototype, "UserList", {
            get: function () { return this.mUserList; },
            enumerable: true,
            configurable: true
        });
        return Department;
    })(ComportentData);
    return Department;
});
