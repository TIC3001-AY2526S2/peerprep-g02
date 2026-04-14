FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN find node_modules/y-websocket -name "*.js" | grep -i "server\|start\|bin" | head -20
EXPOSE 1234
ENV PORT=1234
ENV HOST=0.0.0.0
CMD ["sh", "-c", "ls node_modules/y-websocket/dist/ && node node_modules/y-websocket/dist/server.cjs"]