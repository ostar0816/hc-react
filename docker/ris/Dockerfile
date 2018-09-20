FROM node:10

# copy source files
RUN mkdir -p /usr/src
COPY ./src /usr/src

# install server and client
RUN cd /usr/src/client/ && yarn && \
    cd /usr/src/server && yarn && \
    yarn cache clean

# set release tag from Git into env var
ARG CIRCLE_TAG
ENV RELEASE_TAG=$CIRCLE_TAG

# set release tag from Git into env var
#ARG CIRCLE_TAG
#ENV RELEASE_TAG=$CIRCLE_TAG

# build user client
RUN cd /usr/src/client && yarn run build

# set server port
ENV SERVER_PORT 3000


WORKDIR /usr/src/server/
CMD ["yarn", "run", "startTesting"]
