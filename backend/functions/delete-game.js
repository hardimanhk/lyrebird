import * as dynamoDbLib from "../libraries/dynamo-lib";
import { success, failure } from "../libraries/response-lib";

export async function main(event, context) {
  const params = {
    TableName: "lyrebird-games",
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      gameId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (error) {
    return failure({ status: false });
  }
}