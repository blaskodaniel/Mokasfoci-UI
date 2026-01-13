#!/bin/bash

set -e

# Színes output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Konfig
REMOTE_USER="dietpi"
REMOTE_HOST="192.168.1.110"
REMOTE_PATH="/var/www/WorldCup26-Admin"
APP_NAME="mokasfoci-admin"

echo -e "${GREEN}=== Mokasfoci Admin UI Deployment ===${NC}\n"

# 1. Build
echo -e "${YELLOW}[1/4] Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Build completed${NC}\n"

# 2. Deploy fájlok
echo -e "${YELLOW}[2/4] Deploying files to Raspberry Pi...${NC}"
rsync -rlvz --delete --progress --no-times \
  .next public package.json next.config.mjs .env.production \
  dietpi@192.168.1.110:/var/www/WorldCup26-Admin/
echo -e "${GREEN}✓ Files deployed${NC}\n"

# 3. Telepítés és újraindítás a Pi-on
echo -e "${YELLOW}[3/4] Installing dependencies and restarting app...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /var/www/WorldCup26-Admin
export NODE_ENV=production
npm install --production
pm2 delete mokasfoci-admin 2>/dev/null || true
pm2 start npm --name "mokasfoci-admin" --cwd /var/www/WorldCup26-Admin -- start
pm2 save
ENDSSH
echo -e "${GREEN}✓ App restarted${NC}\n"

# 4. Health check
echo -e "${YELLOW}[4/4] Health check...${NC}"
sleep 3
if ssh ${REMOTE_USER}@${REMOTE_HOST} "pm2 list | grep -q ${APP_NAME}"; then
  echo -e "${GREEN}✓ App is running${NC}\n"
else
  echo -e "${RED}✗ App failed to start${NC}\n"
  exit 1
fi

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}==================================${NC}\n"