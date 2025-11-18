#!/bin/bash


set -e  
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

STACK_NAME="tweeter-stack"

echo -e "${RED}========================================${NC}"
echo -e "${RED}WARNING: Teardown Tweeter Stack${NC}"
echo -e "${RED}========================================${NC}"
echo -e "Stack Name: ${YELLOW}$STACK_NAME${NC}\n"

echo -e "${YELLOW}This will delete:${NC}"
echo -e "  - All Lambda functions (14 functions)"
echo -e "  - API Gateway"
echo -e "  - CloudFormation stack"
echo -e "  - All IAM roles created by the stack"
echo -e "  - CloudWatch log groups\n"

read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${GREEN}Cancelled. No changes made.${NC}"
    exit 0
fi

echo -e "\n${YELLOW}Deleting SAM stack...${NC}"

if command -v sam &> /dev/null; then
    sam delete --stack-name "$STACK_NAME" --no-prompts
else
    aws cloudformation delete-stack --stack-name "$STACK_NAME"
    echo -e "${YELLOW}Waiting for stack deletion...${NC}"
    aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME"
fi

echo -e "${GREEN}✓ Stack deleted${NC}\n"

echo -e "${YELLOW}Cleaning up local files...${NC}"

if [ -d ".aws-sam" ]; then
    rm -rf .aws-sam
    echo -e "${GREEN}✓ Deleted .aws-sam directory${NC}"
fi

if [ -f "deployment-info.json" ]; then
    rm deployment-info.json
    echo -e "${GREEN}✓ Deleted deployment-info.json${NC}"
fi

if [ -f "samconfig.toml" ] && [ -f "samconfig.toml.bak" ]; then
    echo -e "${YELLOW}Note: samconfig.toml preserved (contains deployment settings)${NC}"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Teardown Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "All AWS resources have been removed.\n"
