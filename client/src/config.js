export default {
    MAX_ATTACHMENT_SIZE: 10000000,
    s3: {
      REGION: "us-east-1",
      BUCKET: "lyrebird-app"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://4avpuxu6gb.execute-api.us-east-1.amazonaws.com/dev"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_tw8NR2cdm",
      APP_CLIENT_ID: "34q4sks31snchqfc7f1o7hm1v9",
      IDENTITY_POOL_ID: "us-east-1:c354320d-f34a-44dc-8a0a-757e0aa95670"
    }
  };