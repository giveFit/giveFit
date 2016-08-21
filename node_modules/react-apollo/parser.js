"use strict";
var apollo_client_1 = require('apollo-client');
var invariant = require('invariant');
(function (DocumentType) {
    DocumentType[DocumentType["Query"] = 0] = "Query";
    DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
})(exports.DocumentType || (exports.DocumentType = {}));
var DocumentType = exports.DocumentType;
function parser(document) {
    var fragments, queries, mutations, variables, definitions, type, name;
    invariant((!!document || !!document.kind), "Argument of " + document + " passed to parser was not a valid GraphQL Document. You may need to use 'graphql-tag' or another method to convert your operation into a document");
    fragments = document.definitions.filter(function (x) { return x.kind === 'FragmentDefinition'; });
    fragments = apollo_client_1.createFragment({
        kind: 'Document',
        definitions: fragments.slice(),
    });
    queries = document.definitions.filter(function (x) { return x.kind === 'OperationDefinition' && x.operation === 'query'; });
    mutations = document.definitions.filter(function (x) { return x.kind === 'OperationDefinition' && x.operation === 'mutation'; });
    if (fragments.length && (!queries.length || !mutations.length)) {
        invariant(true, "Passing only a fragment to 'graphql' is not yet supported. You must include a query or mutation as well");
    }
    if (queries.length && mutations.length) {
        invariant((queries.length && mutations.length), "react-apollo only supports a query or a mutation per HOC. " + document + " had " + queries.length + " queries and " + mutations.length + " muations. You can use 'combineOperations' to join multiple operation types to a component");
    }
    type = queries.length ? DocumentType.Query : DocumentType.Mutation;
    definitions = queries.length ? queries : mutations;
    if (definitions.length !== 1) {
        invariant((definitions.length !== 1), "react-apollo only supports one defintion per HOC. " + document + " had " + definitions.length + " definitions. You can use 'combineOperations' to join multiple operation types to a component");
    }
    variables = definitions[0].variableDefinitions || [];
    var hasName = definitions[0].name && definitions[0].name.kind === 'Name';
    name = hasName ? definitions[0].name.value : 'data';
    fragments = fragments.length ? fragments : [];
    return { name: name, type: type, variables: variables, fragments: fragments };
}
exports.parser = parser;
//# sourceMappingURL=parser.js.map