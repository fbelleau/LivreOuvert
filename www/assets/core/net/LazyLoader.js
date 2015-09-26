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
 * @copyright Cortex Media 2015
 *
 * @author Mathieu Rhéaume
 */
define(["require", "exports", "../../promise/promise"], function (require, exports, P) {
    var LazyLoader = (function () {
        function LazyLoader() {
        }
        LazyLoader.loadJSON = function (aFile, aApiToken, aDatastoreObject) {
            var deferObject = P.defer();
            if (aDatastoreObject != null && aDatastoreObject.get(aFile) != null) {
                deferObject.resolve(aDatastoreObject.get(aFile));
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", aFile, true);
                try {
                    xhr.responseType = "json";
                }
                catch (e) {
                    if (xhr.responseType !== "json" && xhr.responseText !== "json") {
                    }
                }
                if (aApiToken !== undefined && aApiToken.length > 0) {
                    xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
                }
                xhr.onerror = function (error) {
                    deferObject.reject(error);
                };
                xhr.onload = function () {
                    if (xhr.response !== null) {
                        var objToReturn;
                        if (typeof (xhr.response) === "string") {
                            objToReturn = JSON.parse(xhr.response);
                        }
                        else {
                            objToReturn = xhr.response;
                        }
                        if (aDatastoreObject !== undefined) {
                            aDatastoreObject.set(aFile, objToReturn);
                        }
                        deferObject.resolve(objToReturn);
                    }
                    else {
                        deferObject.reject(new Error("No valid JSON object was found (" +
                            xhr.status + " " + xhr.statusText + ")"));
                    }
                };
                xhr.send();
            }
            return deferObject.promise();
        };
        LazyLoader.loadFile = function (aFile) {
            var deferObject = P.defer(), xhr = new XMLHttpRequest();
            xhr.open("GET", aFile, true);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                if (xhr.response !== null) {
                    var objToReturn;
                    if (typeof (xhr.response) === "string") {
                        objToReturn = JSON.parse(xhr.response);
                    }
                    else {
                        objToReturn = xhr.response;
                    }
                    deferObject.resolve(objToReturn);
                }
                else {
                    deferObject.reject(new Error("No valid JSON object was found (" +
                        xhr.status + " " + xhr.statusText + ")"));
                }
            };
            xhr.send();
            return deferObject.promise();
        };
        LazyLoader.loadTemplate = function (aFile) {
            var deferObject = P.defer(), xhr = new XMLHttpRequest();
            xhr.open("GET", aFile, true);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                if (xhr.response !== null) {
                    deferObject.resolve(xhr.response);
                }
                else {
                    deferObject.reject(new Error("No valid JSON object was found (" +
                        xhr.status + " " + xhr.statusText + ")"));
                }
            };
            xhr.send();
            return deferObject.promise();
        };
        LazyLoader.sendJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
            var deferObject = P.defer(), xhr = this.getXHRObject("POST", aFile, aSyncOrNot, aApiToken);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                LazyLoader.handleXHRReponse(xhr, deferObject);
            };
            xhr.send(JSON.stringify(aJsonObject));
            return deferObject.promise();
        };
        LazyLoader.updateJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
            var deferObject = P.defer(), xhr = this.getXHRObject("PUT", aFile, aSyncOrNot, aApiToken);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                LazyLoader.handleXHRReponse(xhr, deferObject);
            };
            xhr.send(JSON.stringify(aJsonObject));
            return deferObject.promise();
        };
        LazyLoader.deleteRequest = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
            var deferObject = P.defer();
            var xhr = this.getXHRObject("DELETE", aFile, aSyncOrNot, aApiToken);
            xhr.onerror = function (error) {
                deferObject.reject(error);
            };
            xhr.onload = function () {
                deferObject.resolve(xhr.status);
            };
            xhr.send();
            return deferObject.promise();
        };
        LazyLoader.handleXHRReponse = function (requestObject, aDeferObject) {
            var requestResponse = requestObject.response;
            if (requestResponse !== null) {
                var objToReturn;
                if (typeof (requestResponse) === "string" && requestResponse !== "") {
                    objToReturn = JSON.parse(requestResponse);
                }
                else {
                    objToReturn = requestResponse;
                }
                aDeferObject.resolve(objToReturn);
            }
            else {
                aDeferObject.reject(new Error("No valid JSON object was found (" +
                    requestObject.status + " " + requestObject.statusText + ")"));
            }
        };
        LazyLoader.getXHRObject = function (aHttpOperation, aFile, aSyncOrNot, aApiToken) {
            var xhr = new XMLHttpRequest;
            xhr.open(aHttpOperation, aFile, aSyncOrNot);
            if (aApiToken !== undefined && aApiToken.length > 0) {
                xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
            }
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            return xhr;
        };
        return LazyLoader;
    })();
    return LazyLoader;
});
