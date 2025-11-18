#!/bin/bash


set -e  

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Tweeter AWS SAM Deployment${NC}"
echo -e "${GREEN}========================================${NC}\n"

if ! command -v sam &> /dev/null; then
    echo -e "${RED}Error: AWS SAM CLI is not installed${NC}"
    echo -e "${YELLOW}Install it with:${NC}"
    echo -e "  brew install aws-sam-cli  ${BLUE}# macOS${NC}"
    echo -e "  pip install aws-sam-cli   ${BLUE}# Using pip${NC}"
    echo -e "\nSee: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo -e "${YELLOW}Configure with:${NC} aws configure"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || echo "us-east-1")
echo -e "${GREEN}✓ AWS Account: ${ACCOUNT_ID}${NC}"
echo -e "${GREEN}✓ Region: ${REGION}${NC}\n"

if [ ! -d "layer/nodejs/node_modules" ]; then
    echo -e "${YELLOW}Lambda layer not initialized. Running update-layer.sh...${NC}"
    ./update-layer.sh
    echo ""
fi

echo -e "${YELLOW}[1/4] Building TypeScript code...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist directory not found after build${NC}"
    exit 1
fi
echo -e "${GREEN}✓ TypeScript build complete${NC}\n"

echo -e "${YELLOW}[2/4] Validating SAM template...${NC}"
sam validate --lint
echo -e "${GREEN}✓ Template is valid${NC}\n"

echo -e "${YELLOW}[3/4] Building SAM application...${NC}"
echo -e "${BLUE}Packaging Lambda functions and layer...${NC}"
sam build
echo -e "${GREEN}✓ SAM build complete${NC}\n"

echo -e "${YELLOW}[4/4] Deploying to AWS...${NC}"
echo -e "${BLUE}This will:${NC}"
echo -e "  - Create/update CloudFormation stack 'tweeter-server'"
echo -e "  - Deploy all 14 Lambda functions"
echo -e "  - Deploy shared dependencies layer"
echo -e "  - Create/update API Gateway"
echo -e "  - Configure all endpoints with CORS\n"

if [ ! -f "samconfig.toml" ] || ! grep -q "stack_name" samconfig.toml 2>/dev/null; then
    echo -e "${YELLOW}First-time deployment detected. Running with --guided${NC}\n"
    sam deploy --guided
else
    if [ "$1" == "--guided" ] || [ "$1" == "-g" ]; then
        sam deploy --guided
    else
        sam deploy
    fi
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

STACK_NAME="tweeter-server"
API_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`TweeterApiUrl`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -n "$API_URL" ]; then
    echo -e "${GREEN}API Gateway URL:${NC}"
    echo -e "${YELLOW}${API_URL}${NC}\n"

    echo -e "${GREEN}Available Endpoints:${NC}"
    echo -e "  POST ${API_URL}login"
    echo -e "  POST ${API_URL}register"
    echo -e "  POST ${API_URL}logout"
    echo -e "  POST ${API_URL}user"
    echo -e "  POST ${API_URL}follow"
    echo -e "  POST ${API_URL}unfollow"
    echo -e "  POST ${API_URL}followers"
    echo -e "  POST ${API_URL}followees"
    echo -e "  POST ${API_URL}follower-count"
    echo -e "  POST ${API_URL}followee-count"
    echo -e "  POST ${API_URL}is-follower"
    echo -e "  POST ${API_URL}status"
    echo -e "  POST ${API_URL}feed"
    echo -e "  POST ${API_URL}story\n"

    cat > deployment-info.json <<EOF
{
  "apiUrl": "$API_URL",
  "stackName": "$STACK_NAME",
  "region": "$REGION",
  "deploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    echo -e "${GREEN}✓ Deployment info saved to: deployment-info.json${NC}\n"
fi

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Test endpoints: ${GREEN}./test-sam.sh${NC}"
echo -e "2. View logs: ${GREEN}sam logs -n tweeter-Login --tail${NC}"
echo -e "3. View stack in AWS Console: ${BLUE}https://console.aws.amazon.com/cloudformation${NC}"
echo -e "4. Update frontend with API URL: ${YELLOW}${API_URL}${NC}\n"

echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  sam logs -n tweeter-Login --tail  ${BLUE}# View function logs${NC}"
echo -e "  sam local start-api               ${BLUE}# Test locally${NC}"
echo -e "  sam build && sam deploy           ${BLUE}# Redeploy after changes${NC}"
echo -e "  sam delete                        ${BLUE}# Remove all resources${NC}\n"
