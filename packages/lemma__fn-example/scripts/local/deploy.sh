#!/bin/bash

CWD=$(dirname "$0")
PACKAGE_DIR=$CWD/../..
BUILD_DIR=$PACKAGE_DIR/build

AWS_REGION=ap-northeast-2
AWS_LAMBDA_FUNCTION_NAME=$1
AWS_LOG_GROUP_NAME=/aws/lambda/$AWS_LAMBDA_FUNCTION_NAME
AWS_IAM_ROLE_NAME="lambda-$AWS_LAMBDA_FUNCTION_NAME-role"

# Bundle the function
echo "Bundling function $AWS_LAMBDA_FUNCTION_NAME ..."
yarn build
echo ""

# Zip the function
echo "Zipping function $AWS_LAMBDA_FUNCTION_NAME ..."
rm build.zip
cd $BUILD_DIR
zip ../build.zip index.js
cd ..
echo ""

# Update AWS IAM Role for Lambda function
echo "Creating AWS IAM Role for Lambda function $AWS_LAMBDA_FUNCTION_NAME ..."

awslocal iam delete-role \
    --role-name $AWS_IAM_ROLE_NAME

awslocal iam create-role \
    --role-name $AWS_IAM_ROLE_NAME \
    --assume-role-policy-document file://$PACKAGE_DIR/res/iam-role.json

# Create AWS CloudWatch Log Group, if not exists
echo "Creating AWS CloudWatch Log Group $AWS_LOG_GROUP_NAME ..."

awslocal logs create-log-group \
    --region $AWS_REGION \
    --log-group-name $AWS_LOG_GROUP_NAME

echo ""

# Deploy the function to AWS Lambda in localstack
echo "Deploying function $AWS_LAMBDA_FUNCTION_NAME to AWS Lambda in localstack ..."

awslocal lambda delete-function \
    --region $AWS_REGION \
    --function-name $AWS_LAMBDA_FUNCTION_NAME

awslocal lambda create-function \
    --region $AWS_REGION \
    --function-name $AWS_LAMBDA_FUNCTION_NAME \
    --runtime nodejs16.x \
    --handler index.handler \
    --zip-file fileb://$PACKAGE_DIR/build.zip \
    --role arn:aws:iam::000000000000:role/$AWS_IAM_ROLE_NAME
echo ""
