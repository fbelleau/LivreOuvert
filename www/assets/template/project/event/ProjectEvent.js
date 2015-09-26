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
define(["require", "exports", "../../../core/event/Event"], function (require, exports, Event) {
    var ProjectEvent = (function (_super) {
        __extends(ProjectEvent, _super);
        function ProjectEvent(aEventName) {
            _super.call(this, aEventName);
        }
        ProjectEvent.SHOW_PROJECT_CREATION = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_CREATION";
        ProjectEvent.SHOW_PROJECT_LIST = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_LIST";
        ProjectEvent.SHOW_PROJECT_EDIT = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_EDIT";
        ProjectEvent.SHOW_EVALUATION = "com.cortex.template.project.event.ProjectEvent::SHOW_EVALUATION";
        return ProjectEvent;
    })(Event);
    return ProjectEvent;
});
