import uuid from "uuid";
import * as dynamoDbLib from "../libraries/dynamo-lib";
import { success, failure } from "../libraries/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "lyrebird-games",
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      gameId: uuid.v1(),
      content: data.content,
      createdAt: Date.now()
    }
  };

  try {
      await dynamoDbLib.call("put", params);
      return success(params.Item);
  } catch (error) {
      console.log(error);
      return failure({status: false});
  }
}