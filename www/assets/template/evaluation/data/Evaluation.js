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
    var Evaluation = (function (_super) {
        __extends(Evaluation, _super);
        function Evaluation() {
            _super.call(this);
            this.mFeatureList = new Array();
            this.mDepartmentList = new Array();
        }
        Evaluation.prototype.Destroy = function () {
            var featureListLength = this.mFeatureList.length;
            for (var i = 0; i < featureListLength; i++) {
                this.mFeatureList[i].Destroy();
            }
            this.mFeatureList.length = 0;
            this.mFeatureList = null;
            this.mDepartmentList.length = 0;
            this.mDepartmentList = null;
        };
        Object.defineProperty(Evaluation.prototype, "Client", {
            get: function () { return this.mClient; },
            set: function (aValue) { this.mClient = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "Name", {
            get: function () { return this.mName; },
            set: function (aValue) { this.mName = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "Description", {
            get: function () { return this.mDescription; },
            set: function (aValue) { this.mDescription = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "FeatureList", {
            get: function () { return this.mFeatureList; },
            set: function (aValue) { this.mFeatureList = aValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Evaluation.prototype, "DepartmentList", {
            get: function () { return this.mDepartmentList; },
            set: function (aValue) { this.mDepartmentList = aValue; },
            enumerable: true,
            configurable: true
        });
        return Evaluation;
    })(ComponentData);
    return Evaluation;
});
