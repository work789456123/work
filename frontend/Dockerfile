# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Add build-time arguments for environment variables
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx config to handle SPA routing (important for React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
