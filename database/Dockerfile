# Use official PostgreSQL 15 image
FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=milkman
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=Welcome@1234

# Copy initialization script
COPY init-db.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
