import * as dynamoDbLib from "../libraries/dynamo-lib";
import { success, failure } from "../libraries/response-lib";

export async function main(event, context) {
  const params = {
    TableName: "users",
  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (error) {
    return failure({ status: false });
  }
}