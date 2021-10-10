const { DynamoDB } = require('aws-sdk');

exports.handler = async function (event) {
  const dynamo = new DynamoDB();

  console.log("request:", JSON.stringify(event, undefined, 2));

  // update dynamo entry for "path" with hits++
  await dynamo.updateItem({
    TableName: process.env.TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: { ':incr': { N: '1' } }
  }).promise();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, CDK! You've hit ${event.path}\n`,
  };
};
