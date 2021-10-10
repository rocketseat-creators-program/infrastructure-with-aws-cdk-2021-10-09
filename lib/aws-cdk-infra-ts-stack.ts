import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamo from '@aws-cdk/aws-dynamodb';

export class AwsCdkInfraTsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'ExpertsClubS3', {
      versioned: true
    })
    
    const dynamoTable = new dynamo.Table(this, 'ExpertsClub-Dynamo', {
      partitionKey: {
        name: "path",
        type: dynamo.AttributeType.STRING
      }
    })

    const lambdaExperts = new lambda.Function(this, 'ExpertsClubLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        TABLE_NAME: dynamoTable.tableName
      }
    })

    dynamoTable.grantReadWriteData(lambdaExperts)
    
    new apigw.LambdaRestApi(this, 'ExpertsClubAPI-GW', {
      handler: lambdaExperts
    })
  }
}
