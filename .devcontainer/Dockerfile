# Start from the linuxbrew/brew image
FROM linuxbrew/brew

# Switch to root to install apt packages
USER root

# Install required packages using apt
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    build-essential \
    curl \
    ca-certificates && \
    apt-get purge --auto-remove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Switch back to linuxbrew user
USER linuxbrew

# Install Node.js and Bun using brew
RUN brew install node oven-sh/bun/bun

# Set environment variables for bun
ENV BUN_INSTALL="/home/linuxbrew/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Define the workspace directory
WORKDIR /workspace