FROM node as bazel-base

LABEL maintainer="Dynatrace DesignOps Team <designops@dynatrace.com>" \
      description="This image is used for bazel execution on our CircleCI"

ENV USE_BAZEL_VERSION 3.2.0
ENV BAZEL_BUILD_CACHE_FOLDER /bazel_build_cache
ENV BAZEL_BIN /usr/local/lib/node_modules/@bazel/bazelisk/bazelisk-linux_amd64

RUN apt-get update && apt-get install -y openssl && \
    npm i -g @bazel/bazelisk && \
    # The bazel version command starts downloading the bazel binary for the specified version
    # as bazelisk is only a version manager for bazel it needs a command to download the bin
    bazel version && \
    # Provide the bazel binary globally. We don't want to access the binary
    # through Node as it could result in limited memory.
    chmod a+x ${BAZEL_BIN} && \
    ln -fs ${BAZEL_BIN} /usr/local/bin/bazel


COPY tools/bazel_build_cache ${BAZEL_BUILD_CACHE_FOLDER}

FROM bazel-base

WORKDIR /root/barista

COPY WORKSPACE BUILD.bazel package.json package-lock.json ./

RUN bazel info


ENTRYPOINT [ "/bin/bash" ]

