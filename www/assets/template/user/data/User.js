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
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.call(this);
        }
        Object.defineProperty(User.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Email", {
            get: function () { return this.mEmail; },
            set: function (aValue) { this.mEmail = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Password", {
            get: function () { return this.mPassword; },
            set: function (aValue) { this.mPassword = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Picture", {
            get: function () { return this.mPicture; },
            set: function (aValue) { this.mPicture = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(User.prototype, "Department", {
            get: function () { return this.mDepartment; },
            set: function (aValue) { this.mDepartment = aValue; },
            enumerable: true,
            configurable: true
        });
        return User;
    })(ComponentData);
    return User;
});
