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
 * @copyright Cortex Media 2015
 *
 * @author Mathieu Rhéaume
 */
define(["require", "exports"], function (require, exports) {
    var DomManipulator = (function () {
        function DomManipulator() {
        }
        DomManipulator.CreateElement = function (aElementType, aTextToAppend, aClassName, aNodeToAppendTo) {
            if (aTextToAppend === void 0) { aTextToAppend = ""; }
            if (aClassName === void 0) { aClassName = ""; }
            var newHTMLElement = document.createElement(aElementType);
            newHTMLElement.textContent = aTextToAppend;
            newHTMLElement.className = aClassName;
            if (aNodeToAppendTo != null) {
                aNodeToAppendTo.appendChild(newHTMLElement);
            }
            return newHTMLElement;
        };
        DomManipulator.CreateElementWithChild = function (aElementType, aClassName, aTextToAppend, aChildList) {
            var element = document.createElement(aElementType);
            element.className = aClassName;
            if (aTextToAppend != null) {
                var textNode = document.createTextNode(aTextToAppend);
                aChildList.push(textNode);
            }
            if (aChildList != null) {
                var childListLength = aChildList.length;
                for (var i = 0; i < childListLength; i++) {
                    element.appendChild(aChildList[i]);
                }
            }
            return element;
        };
        DomManipulator.CreateOptionElement = function (aTextToAppend, aValue) {
            var optionElement = DomManipulator.CreateElement("option", aTextToAppend);
            optionElement.value = aValue;
            return optionElement;
        };
        DomManipulator.CreateListOfElement = function (aStringToAppendList, aCoreListType, aElementType) {
            if (aCoreListType === void 0) { aCoreListType = "ul"; }
            if (aElementType === void 0) { aElementType = "li"; }
            var newHTMLList = document.createElement(aCoreListType);
            var stringToAppendListLength = aStringToAppendList.length;
            var newLi;
            for (var i = 0; i < stringToAppendListLength; i = i + 1) {
                newLi = document.createElement(aElementType);
                newLi.appendChild(document.createTextNode(aStringToAppendList[i]));
                newHTMLList.appendChild(newLi);
            }
            return newHTMLList;
        };
        DomManipulator.SetTextOfElementById = function (aId, aText) {
            var element = document.getElementById(aId);
            element.textContent = aText;
        };
        return DomManipulator;
    })();
    return DomManipulator;
});
