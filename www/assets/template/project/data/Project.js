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
    var Project = (function (_super) {
        __extends(Project, _super);
        function Project() {
            _super.call(this);
            this.mEvaluationList = new Array();
        }
        Project.prototype.Destroy = function () {
            var evaluationListLength = this.mEvaluationList.length;
            for (var i = 0; i < evaluationListLength; i++) {
                this.mEvaluationList[i].Destroy();
            }
            this.mEvaluationList.length = 0;
            this.mEvaluationList = null;
        };
        Object.defineProperty(Project.prototype, "Client", {
            get: function () { return this.mClient; },
            set: function (aValue) { this.mClient = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "Description", {
            get: function () { return this.mDescription; },
            set: function (aValue) { this.mDescription = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "URL", {
            get: function () { return this.mURL; },
            set: function (aValue) { this.mURL = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Project.prototype, "EvaluationList", {
            get: function () { return this.mEvaluationList; },
            set: function (aValue) { this.mEvaluationList = aValue; },
            enumerable: true,
            configurable: true
        });
        return Project;
    })(ComponentData);
    return Project;
});
