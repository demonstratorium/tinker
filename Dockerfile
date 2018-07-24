FROM alpine
RUN apk add nodejs
COPY . .
CMD ["node","server.js"]
