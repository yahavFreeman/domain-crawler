FROM ghcr.io/puppeteer/puppeteer:24.22.3 # pulls a version of node with puppeteer and chromium installed
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
    NODE_ENV=production
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install
COPY server .
CMD ["node", "index.js"]