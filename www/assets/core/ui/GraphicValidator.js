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
 * @author Jonathan Roy
 */
define(["require", "exports"], function (require, exports) {
    var GraphicValidator = (function () {
        function GraphicValidator() {
        }
        GraphicValidator.ShowInputErrorMessage = function (aInputID, aMessage) {
            var inputErrorContainer = document.createElement("div");
            var triangleElement = document.createElement("div");
            var inputElement = document.getElementById(aInputID);
            triangleElement.className = "triangle-error";
            inputErrorContainer.id = aInputID + "Error";
            inputErrorContainer.className = "error-message-input";
            inputErrorContainer.textContent = aMessage;
            inputErrorContainer.appendChild(triangleElement);
            inputErrorContainer.style.width = String(inputElement.clientWidth) + "px";
            inputElement.parentNode.insertBefore(inputErrorContainer, inputElement.nextSibling);
            inputElement.style.borderColor = "#d7564d";
        };
        GraphicValidator.HideInputErrorMessage = function (aInputID) {
            var inputErrorElement = document.getElementById(aInputID + "Error");
            if (inputErrorElement == null) {
                return;
            }
            var inputElement = document.getElementById(aInputID);
            inputElement.parentElement.removeChild(document.getElementById(aInputID + "Error"));
            inputElement.style.borderColor = "";
        };
        GraphicValidator.ShowErrorMessageAtContainer = function (idElement, msg) {
            var errorContainer = document.createElement("div");
            var container = document.getElementById(idElement);
            errorContainer.className = "error-message-container";
            errorContainer.textContent = msg;
            container.appendChild(errorContainer);
        };
        GraphicValidator.RemovesAllErrorMessages = function () {
            var errorMessages = document.querySelectorAll(".error-message-input, .error-message-container");
            var errorMessageLength = errorMessages.length;
            if (errorMessageLength > 0) {
                for (var i = 0; i < errorMessageLength; i++) {
                    errorMessages[i].parentNode.removeChild(errorMessages[i]);
                }
                var lengthErrorInputElements = this.errorInputElements.length;
                if (lengthErrorInputElements > 0) {
                    for (i = 0; i < lengthErrorInputElements; i++) {
                        this.errorInputElements[i].removeAttribute("style");
                    }
                    this.errorInputElements = [];
                }
            }
        };
        GraphicValidator.errorInputElements = [];
        return GraphicValidator;
    })();
    return GraphicValidator;
});
