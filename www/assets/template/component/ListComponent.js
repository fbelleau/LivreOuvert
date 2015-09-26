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
define(["require", "exports", "../../core/mvc/event/MVCEvent", "../../core/event/EventDispatcher"], function (require, exports, MVCEvent, EventDispatcher) {
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent() {
            _super.call(this);
        }
        ListComponent.prototype.Init = function (aComponentListID) {
            this.mComponentDataBinding = new Array();
            this.mComponentCreated = 0;
            this.mComponentListDiv = document.getElementById(aComponentListID);
        };
        ListComponent.prototype.Destroy = function () {
            this.mComponentDataBinding.length = 0;
            this.mComponentDataBinding = null;
            this.mComponentListDiv = null;
        };
        ListComponent.prototype.GetDataList = function () {
            var dataList = new Array();
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                dataList.push(this.mComponentDataBinding[i].data);
            }
            return (dataList);
        };
        ListComponent.prototype.GetDataByComponent = function (aComponent) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].component == aComponent) {
                    return (this.mComponentDataBinding[i].data);
                }
            }
            return (null);
        };
        ListComponent.prototype.GetDataByID = function (aID) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].data.ID == aID) {
                    return (this.mComponentDataBinding[i].data);
                }
            }
            return (null);
        };
        ListComponent.prototype.GetComponentByData = function (aData) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].data == aData) {
                    return (this.mComponentDataBinding[i].component);
                }
            }
            return (null);
        };
        ListComponent.prototype.GetComponentByID = function (aID) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].data.ID == aID) {
                    return (this.mComponentDataBinding[i].component);
                }
            }
            return (null);
        };
        ListComponent.prototype.AddComponent = function (aComponentView, aTemplate, aData, aKeepID) {
            if (aKeepID === void 0) { aKeepID = false; }
            if (!aKeepID) {
                aData.ID = this.mComponentCreated.toString();
                this.mComponentCreated++;
            }
            aComponentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);
            aComponentView.LoadTemplate(aTemplate);
            this.mComponentDataBinding.push({ component: aComponentView, data: aData });
        };
        ListComponent.prototype.OnComponentTemplateLoaded = function (aEvent) {
            var componentView = aEvent.target;
            var componentData = this.GetDataByComponent(componentView);
            this.mComponentListDiv.appendChild(componentView.RenderTemplate(componentData));
        };
        ListComponent.prototype.RemoveComponent = function (aComponent) {
            var componentDataBindingLength = this.mComponentDataBinding.length;
            for (var i = 0; i < componentDataBindingLength; i++) {
                if (this.mComponentDataBinding[i].component == aComponent) {
                    break;
                }
            }
            this.mComponentDataBinding.splice(i, 1);
            this.mComponentListDiv.removeChild(aComponent.TemplateDiv);
        };
        return ListComponent;
    })(EventDispatcher);
    return ListComponent;
});
