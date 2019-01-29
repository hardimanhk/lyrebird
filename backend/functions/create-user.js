import uuid from "uuid";
import * as dynamoDbLib from "../libraries/dynamo-lib";
import { success, failure } from "../libraries/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "users",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      name: data.name
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