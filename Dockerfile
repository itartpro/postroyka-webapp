FROM node:alpine

ARG UID
ARG GID
ARG MYUSERNAME
ARG MYUSERGROUP
ENV MYUSERNAME ${MYUSERNAME}
ENV MYUSERGROUP ${MYUSERGROUP}

RUN apk add runuser
RUN addgroup -g $GID -S $MYUSERGROUP && \
adduser -S -u $UID $MYUSERNAME -G $MYUSERGROUP

WORKDIR /home/$MYUSERNAME/webapp
COPY . .
RUN npm install

ENTRYPOINT chown -R $MYUSERNAME:$MYUSERGROUP /home/$MYUSERNAME/webapp && \
exec runuser -u $MYUSERNAME npm run dev