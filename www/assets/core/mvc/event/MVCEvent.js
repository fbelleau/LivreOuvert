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
define(["require", "exports", "../../event/Event"], function (require, exports, Event) {
    var MVCEvent = (function (_super) {
        __extends(MVCEvent, _super);
        function MVCEvent(aEventName) {
            _super.call(this, aEventName);
        }
        MVCEvent.TEMPLATE_LOADED = "com.cortex.core.mvc.event.MVCEvent::TEMPLATE_LOADED";
        MVCEvent.JSON_LOADED = "com.cortex.core.mvc.event.MVCEvent::JSON_LOADED";
        return MVCEvent;
    })(Event);
    return MVCEvent;
});
