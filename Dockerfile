FROM node:22.18.0
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 6000
CMD ["npx", "expo", "start", "--host", "lan", "--port", "6000"]
