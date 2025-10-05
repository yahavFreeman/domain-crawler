# Use Puppeteer image (includes Node + Chromium)
FROM ghcr.io/puppeteer/puppeteer:24.22.3

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies as root
COPY server/package*.json ./
RUN npm install

# Copy the rest of the server code
COPY server ./

# Ensure the CSV folder exists at runtime
RUN mkdir -p api/results/csv

# Expose the port your backend uses
EXPOSE 10000

# Start the backend
CMD ["node", "index.js"]
