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
 * @author Mathieu Rhéaume
 */
define(["require", "exports"], function (require, exports) {
    var ERegexPattern = (function () {
        function ERegexPattern() {
        }
        ERegexPattern.EMAIL_REGEX = /[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
        ERegexPattern.WHITESPACE_REGEX = / /g;
        ERegexPattern.DATE_WITH_DASH_REGEX = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/;
        return ERegexPattern;
    })();
    return ERegexPattern;
});
