import { Document, VariableDefinition, FragmentDefinition } from 'graphql';
export declare enum DocumentType {
    Query = 0,
    Mutation = 1,
}
export interface IDocumentDefinition {
    type: DocumentType;
    name: string;
    variables: VariableDefinition[];
    fragments: FragmentDefinition[];
}
export declare function parser(document: Document): IDocumentDefinition;
