FROM ghcr.io/puppeteer/puppeteer:24.22.3 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
# Give write permissions to pptruser
# RUN chown -R pptruser:pptruser /usr/src/app
# USER pptruser
RUN npm install
COPY . .
CMD ["node", "index.js"]