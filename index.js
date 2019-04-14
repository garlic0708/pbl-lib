import {HttpLink} from "apollo-link-http";
import fetch from 'node-fetch'
import {introspectSchema, makeRemoteExecutableSchema} from "graphql-tools/dist/index";
import {setContext} from "apollo-link-context";
import {services} from "./config";
import mergeSchemas from "graphql-tools/dist/stitching/mergeSchemas";
import config from './config'

const DEFAULT_LIMIT = 10;

/**
 * Get the link to another GraphQL service
 * @param serviceName
 * @returns {Promise<>}
 */
export async function getServiceSchema(serviceName) {
    const link = new HttpLink({uri: `http://${services[serviceName]}/graphql`, fetch});

    const contextLink = setContext((request, prevContext) => {
        return {headers: prevContext.graphqlContext}
    }).concat(link);

    return makeRemoteExecutableSchema({
        schema: await introspectSchema(contextLink),
        link: contextLink,
    })
}

/**
 * Paginate the results of mongoose query
 * @param query
 * @param limit
 * @param cursor
 * @param desc
 * @returns {Promise<{nextCursor: *, items: *}|{nextCursor: null, items}>}
 */
export async function paginate(query, limit, cursor, desc = false) {
    limit = limit || DEFAULT_LIMIT;
    // Fetch one more item
    query = query.limit(limit + 1);
    if (desc) query = query.sort({_id: -1});
    if (cursor) {
        query = query.where('_id');
        query = desc ? query.lte(cursor) : query.gte(cursor)
    }
    const result = await query.exec();
    // If the additional item is present, return its id as nextCursor
    if (result.length === limit + 1) return {
        items: result.slice(0, -1),
        nextCursor: result.slice(-1)[0]._id
    };
    // else, return null as nextCursor
    return {items: result, nextCursor: null}
}

export const dependencies = {};

/**
 * Merge with schemas that the current service is dependent on
 * @param typeDefs
 * @param resolvers
 * @param schemasToMerge
 * @returns {Promise<>}
 */
export async function mergeDependencies(typeDefs, resolvers, schemasToMerge) {
    const schemas = Promise.all(schemasToMerge.map(async serviceName => {
        const schema = await getServiceSchema(serviceName);
        dependencies[serviceName] = schema;
        return schema
    }));
    return mergeSchemas({
        schemas: [
            ...schemas,
            typeDefs,
        ],
        resolvers,
    })
}

/**
 * Helper for delegating to another schema
 * @param schema
 * @param fieldName
 * @param args
 * @param context
 * @param info
 * @returns {*}
 */
export function delegateToSchema({schema, fieldName, args, context, info}) {
    return info.mergeInfo.delegateToSchema({
        schema,
        operation: 'query',
        fieldName,
        args,
        context,
        info,
    })
}

export {config}
