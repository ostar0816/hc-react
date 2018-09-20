import { GQLViewer } from './types';
import { ObjectId } from 'mongodb';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const GraphQLObjectId = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Id representation, based on Mongo Object Ids',
  parseValue(value) {
    return new ObjectId(value);
  },
  serialize(value) {
    return value.toString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  },
});

export function resolveViewerType(): GQLViewer {
  return {
    _id: '1',
  };
}
