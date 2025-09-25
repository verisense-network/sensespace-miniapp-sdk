#!/bin/sh

# NPM publishing script
# Usage: ./publish.sh [patch|minor|major]

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get version type
VERSION_TYPE=${1:-patch}

echo -e "${YELLOW}🚀 Preparing to publish @verisense-network/sensespace-miniapp-sdk...${NC}"

# 1. Check Git status
if [[ $(git status --porcelain) ]]; then
    echo -e "${RED}❌ Git working directory is not clean, please commit all changes first${NC}"
    exit 1
fi

# 2. Check if on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
    echo -e "${YELLOW}⚠️  Currently not on main branch ($BRANCH), are you sure you want to continue? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 3. Check npm login status
if ! npm whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Not logged in to npm, please run first: npm login${NC}"
    exit 1
fi

# 4. Check current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📋 Current version: ${CURRENT_VERSION}${NC}"

# 5. Run tests (if available)
echo -e "${YELLOW}🧪 Running tests...${NC}"
if npm run test >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Tests skipped or failed${NC}"
fi

# 6. Clean and build
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# 7. Preview package contents
echo -e "${YELLOW}📦 Previewing package contents...${NC}"
npm pack --dry-run

# 8. Show what version will be published
NEXT_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version --dry-run)
echo -e "${YELLOW}📈 Version will be updated: ${CURRENT_VERSION} → ${NEXT_VERSION}${NC}"

# 9. Confirm publish
echo -e "${YELLOW}❓ Confirm publishing $VERSION_TYPE version? (y/N)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Publishing cancelled${NC}"
    exit 1
fi

# 10. Update version and publish
echo -e "${GREEN}✨ Publishing version...${NC}"
npm version $VERSION_TYPE
npm publish

# 11. Push tags
echo -e "${GREEN}📌 Pushing Git tags...${NC}"
git push --follow-tags

echo -e "${GREEN}🎉 Publishing successful! Package URL: https://www.npmjs.com/package/@verisense-network/sensespace-miniapp-sdk${NC}"
