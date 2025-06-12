# based on Ubuntu jammy
FROM mongo:7.0.21-jammy
# Switch from `sh -c` to `bash -c` as the shell behind a `RUN` command.
SHELL ["/bin/bash", "-c"]
# Usual updates
RUN apt-get update && apt-get upgrade -y
# Dependencies for sdkman installation
RUN apt-get install curl bash unzip zip -y
# Install jdk
RUN apt-get install openjdk-17-jdk -y
#Install sdkman
RUN export SDKMAN_DIR="/root/.sdkman" && curl -s "https://get.sdkman.io" | bash

# FUN FACTS:
# 1) the `sdk` command is not a binary but a bash script loaded into memory
# 2) Shell sessions are a "process", which means environment variables
#    and declared shell function only exist for
#    the duration that shell session exists
RUN export SDKMAN_DIR="/root/.sdkman"  \
    && source "/root/.sdkman/bin/sdkman-init.sh" \
    #&& sdk install java 8.0.275-amzn \
    && sdk install kotlin

# Once the real binaries (installed by sdkman) exist these are
# the symlinked paths that need to exist on PATH
#ENV PATH=/root/.sdkman/candidates/java/current/bin:$PATH
ENV PATH=/root/.sdkman/candidates/kotlin/current/bin:$PATH


LABEL authors="rrain"


