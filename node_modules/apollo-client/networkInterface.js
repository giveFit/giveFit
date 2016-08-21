"use strict";
var isString = require('lodash.isstring');
var assign = require('lodash.assign');
require('whatwg-fetch');
var printer_1 = require('graphql-tag/printer');
var queryMerging_1 = require('./batching/queryMerging');
function addQueryMerging(networkInterface) {
    return assign(networkInterface, {
        batchQuery: function (requests) {
            if (requests.length === 1) {
                return this.query(requests[0]).then(function (result) {
                    return Promise.resolve([result]);
                });
            }
            var composedRequest = queryMerging_1.mergeRequests(requests);
            return this.query(composedRequest).then(function (composedResult) {
                return queryMerging_1.unpackMergedResult(composedResult, requests);
            });
        },
    });
}
exports.addQueryMerging = addQueryMerging;
function printRequest(request) {
    var printedRequest = {
        debugName: request.debugName,
        query: printer_1.print(request.query),
        variables: request.variables,
        operationName: request.operationName,
    };
    return printedRequest;
}
exports.printRequest = printRequest;
function createNetworkInterface(uri, opts) {
    if (opts === void 0) { opts = {}; }
    if (!uri) {
        throw new Error('A remote enpdoint is required for a network layer');
    }
    if (!isString(uri)) {
        throw new Error('Remote endpoint must be a string');
    }
    var _uri = uri;
    var _opts = assign({}, opts);
    var _middlewares = [];
    var _afterwares = [];
    function applyMiddlewares(_a) {
        var _this = this;
        var request = _a.request, options = _a.options;
        return new Promise(function (resolve, reject) {
            var queue = function (funcs, scope) {
                var next = function () {
                    if (funcs.length > 0) {
                        var f = funcs.shift();
                        f.applyMiddleware.apply(scope, [{ request: request, options: options }, next]);
                    }
                    else {
                        resolve({
                            request: request,
                            options: options,
                        });
                    }
                };
                next();
            };
            queue(_middlewares.slice(), _this);
        });
    }
    function applyAfterwares(_a) {
        var _this = this;
        var response = _a.response, options = _a.options;
        return new Promise(function (resolve, reject) {
            var queue = function (funcs, scope) {
                var next = function () {
                    if (funcs.length > 0) {
                        var f = funcs.shift();
                        f.applyAfterware.apply(scope, [{ response: response, options: options }, next]);
                    }
                    else {
                        resolve({
                            response: response,
                            options: options,
                        });
                    }
                };
                next();
            };
            queue(_afterwares.slice(), _this);
        });
    }
    function fetchFromRemoteEndpoint(_a) {
        var request = _a.request, options = _a.options;
        return fetch(uri, assign({}, _opts, options, {
            body: JSON.stringify(printRequest(request)),
            headers: assign({}, options.headers, {
                Accept: '*/*',
                'Content-Type': 'application/json',
            }),
            method: 'POST',
        }));
    }
    ;
    function query(request) {
        var options = assign({}, _opts);
        return applyMiddlewares({
            request: request,
            options: options,
        }).then(fetchFromRemoteEndpoint)
            .then(function (response) {
            applyAfterwares({
                response: response,
                options: options,
            });
            return response;
        })
            .then(function (result) { return result.json(); })
            .then(function (payload) {
            if (!payload.hasOwnProperty('data') && !payload.hasOwnProperty('errors')) {
                throw new Error("Server response was missing for query '" + request.debugName + "'.");
            }
            else {
                return payload;
            }
        });
    }
    ;
    function use(middlewares) {
        middlewares.map(function (middleware) {
            if (typeof middleware.applyMiddleware === 'function') {
                _middlewares.push(middleware);
            }
            else {
                throw new Error('Middleware must implement the applyMiddleware function');
            }
        });
    }
    function useAfter(afterwares) {
        afterwares.map(function (afterware) {
            if (typeof afterware.applyAfterware === 'function') {
                _afterwares.push(afterware);
            }
            else {
                throw new Error('Afterware must implement the applyAfterware function');
            }
        });
    }
    return addQueryMerging({
        _uri: _uri,
        _opts: _opts,
        _middlewares: _middlewares,
        _afterwares: _afterwares,
        query: query,
        use: use,
        useAfter: useAfter,
    });
}
exports.createNetworkInterface = createNetworkInterface;
//# sourceMappingURL=networkInterface.js.map