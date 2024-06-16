FROM linuxbrew/brew as install-step

RUN apt update && \
    apt install -y git build-essential
    
USER linuxbrew

RUN brew install oven-sh/bun/bun
RUN brew install node

FROM install-step
WORKDIR /workspace
