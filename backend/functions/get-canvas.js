import * as dynamoDbLib from "../libraries/dynamo-lib";
import { success, failure } from "../libraries/response-lib";

export async function main(event, context) {

  const params = {
    TableName: "lyrebird-canvases",
    Key: {
        canvasId: event.pathParameters.id
    }
  };

  try {
      const result = await dynamoDbLib.call("get", params);
      if (result.Item) {
          return success(result.Item);
      } else {
          return failure({status: false, error: "Item not found"});
      }
  } catch (error) {
      return failure({status: false, message: error.message});
  }
}