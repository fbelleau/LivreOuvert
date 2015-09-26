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
define(["require", "exports", "./Task"], function (require, exports, Task) {
    var Feature = (function (_super) {
        __extends(Feature, _super);
        function Feature() {
            _super.call(this);
            this.mTaskList = new Array();
        }
        Feature.prototype.Destroy = function () {
            var taskListLength = this.mTaskList.length;
            for (var i = 0; i < taskListLength; i++) {
                this.mTaskList[i].Destroy();
            }
            this.mTaskList.length = 0;
            this.mTaskList = null;
        };
        Object.defineProperty(Feature.prototype, "TaskList", {
            get: function () { return this.mTaskList; },
            set: function (aValue) { this.mTaskList = aValue; },
            enumerable: true,
            configurable: true
        });
        return Feature;
    })(Task);
    return Feature;
});
