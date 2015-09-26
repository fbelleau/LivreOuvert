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
define(["require", "exports", "./EventGroup"], function (require, exports, EventGroup) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.mListenerDictionary = {};
        }
        EventDispatcher.prototype.Destroy = function () {
            this.mListenerDictionary = undefined;
        };
        EventDispatcher.prototype.HasEventListener = function (aEventName) {
            return (this.mListenerDictionary[aEventName] != null);
        };
        EventDispatcher.prototype.AddEventListener = function (aEventName, aCallback, aScope) {
            if (this.mListenerDictionary[aEventName] == null) {
                this.mListenerDictionary[aEventName] = new EventGroup();
            }
            if (!this.mListenerDictionary[aEventName].Exist(aCallback, aScope)) {
                this.mListenerDictionary[aEventName].Add(aCallback, aScope);
            }
        };
        EventDispatcher.prototype.RemoveEventListener = function (aEventName, aCallback, aScope) {
            if (!this.HasEventListener(aEventName)) {
                return;
            }
            var callbackIndex = this.mListenerDictionary[aEventName].Find(aCallback, aScope);
            if (callbackIndex >= 0) {
                this.mListenerDictionary[aEventName].Remove(callbackIndex);
            }
            if (this.mListenerDictionary[aEventName].Empty()) {
                this.mListenerDictionary[aEventName].Destroy();
                this.mListenerDictionary[aEventName] = undefined;
            }
        };
        EventDispatcher.prototype.DispatchEvent = function (aEvent) {
            if (this.mListenerDictionary[aEvent.eventName] != null) {
                aEvent.target = this;
                this.mListenerDictionary[aEvent.eventName].FireEvent(aEvent);
            }
        };
        return EventDispatcher;
    })();
    return EventDispatcher;
});
