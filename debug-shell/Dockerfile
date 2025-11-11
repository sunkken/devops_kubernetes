# Use lightweight Debian
FROM debian:bookworm-slim

# Install curl (bash is already included)
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Keep the container running with interactive bash
CMD ["bash"]
