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
define(["require", "exports"], function (require, exports) {
    var Team = (function () {
        function Team() {
            this.mDepartmentList = new Array();
        }
        Object.defineProperty(Team.prototype, "ID", {
            get: function () { return this.mID; },
            set: function (aValue) { this.mID = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "URL", {
            get: function () { return this.mURL; },
            set: function (aValue) { this.mURL = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "DepartmentList", {
            get: function () { return this.mDepartmentList; },
            enumerable: true,
            configurable: true
        });
        Team.prototype.FromJSON = function (aData) {
            this.ID = aData.route_id;
        };
        return Team;
    })();
    return Team;
});
