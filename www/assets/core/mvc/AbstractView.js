/******
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
define(["require", "exports", "../net/LazyLoader", "../event/EventDispatcher", "../mouse/event/MouseTouchEvent", "./event/MVCEvent", "../mouse/TouchBehavior"], function (require, exports, LazyLoader, EventDispatcher, MouseTouchEvent, MVCEvent, TouchBehavior) {
    var AbstractView = (function (_super) {
        __extends(AbstractView, _super);
        function AbstractView(aID) {
            if (aID === void 0) { aID = ""; }
            _super.call(this);
            this.mID = aID;
        }
        AbstractView.prototype.Destroy = function () {
            this.mTouchBehavior.Destroy();
            this.mTouchBehavior = null;
            this.mData = null;
            this.mTemplateHTML = null;
        };
        AbstractView.prototype.LoadTemplate = function (aTemplatePath) {
            var _this = this;
            var promise = LazyLoader.loadTemplate(aTemplatePath);
            promise.then(function () { return _this.OnTemplateLoaded(promise.result); });
        };
        Object.defineProperty(AbstractView.prototype, "Data", {
            get: function () { return this.mData; },
            set: function (aData) { this.mData = aData; },
            enumerable: true,
            configurable: true
        });
        AbstractView.prototype.RenderTemplate = function (aData) {
            this.Data = aData;
            if (this.mTemplate == "") {
                this.mTemplateHTML = "TEMPLATE IS EMPTY";
            }
            else {
                this.mTemplateHTML = tmpl(this.mTemplate, aData);
            }
            return this.mTemplateHTML;
        };
        AbstractView.prototype.AddClickControl = function (aElement) {
            if (this.mTouchBehavior == null) {
                this.mTouchBehavior = new TouchBehavior();
            }
            this.mTouchBehavior.AddClickControl(aElement);
            this.mTouchBehavior.AddEventListener(MouseTouchEvent.TOUCHED, this.OnTouched, this);
        };
        AbstractView.prototype.RemoveClickControl = function (aElement) {
            this.mTouchBehavior.RemoveClickControl(aElement);
        };
        Object.defineProperty(AbstractView.prototype, "ID", {
            get: function () { return (this.mID); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractView.prototype, "Template", {
            get: function () { return (this.mTemplate); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractView.prototype, "TemplateHTML", {
            get: function () { return (this.mTemplateHTML); },
            enumerable: true,
            configurable: true
        });
        AbstractView.prototype.OnTemplateLoaded = function (aTemplate) {
            this.mTemplate = aTemplate;
            this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
        };
        AbstractView.prototype.OnTouched = function (aEvent) {
            this.DispatchEvent(aEvent);
        };
        return AbstractView;
    })(EventDispatcher);
    return AbstractView;
});
