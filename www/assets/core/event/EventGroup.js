/***
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
    var EventGroup = (function () {
        function EventGroup() {
            this.mCallbackList = new Array();
        }
        EventGroup.prototype.Destroy = function () {
            this.mCallbackList.splice(0, this.mCallbackList.length);
            this.mCallbackList = null;
        };
        EventGroup.prototype.Add = function (aCallback, aScope) {
            this.mCallbackList.push({
                callback: aCallback,
                scope: aScope
            });
        };
        EventGroup.prototype.Remove = function (aIndex) {
            this.mCallbackList.splice(aIndex, 1);
        };
        EventGroup.prototype.Find = function (aCallback, aScope) {
            var index = -1;
            var callbackListLength = this.mCallbackList.length;
            for (var i = 0; i < callbackListLength; i++) {
                var callbackObject = this.mCallbackList[i];
                if ("" + callbackObject.callback === "" + aCallback && callbackObject.scope === aScope) {
                    index = i;
                    break;
                }
            }
            return (index);
        };
        EventGroup.prototype.Exist = function (aCallback, aScope) {
            return (this.Find(aCallback, aScope) >= 0);
        };
        EventGroup.prototype.Empty = function () { return (this.mCallbackList.length <= 0); };
        EventGroup.prototype.FireEvent = function (aEvent) {
            var callbackListLength = this.mCallbackList == null ? 0 : this.mCallbackList.length;
            for (var i = callbackListLength - 1; i >= 0; i--) {
                this.mCallbackList[i].callback.apply(this.mCallbackList[i].scope, [aEvent]);
            }
        };
        return EventGroup;
    })();
    return EventGroup;
});
