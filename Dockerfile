FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY tapioca-estacao-br/package*.json ./tapioca-estacao-br/
COPY lima-climatizacao/package*.json ./lima-climatizacao/
COPY lucas-construcoes/package*.json ./lucas-construcoes/
COPY movelaria-batel/package*.json ./movelaria-batel/
COPY webforge/package*.json ./webforge/
RUN --mount=type=secret,id=ca_bundle \
    if [ -f /run/secrets/ca_bundle ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/ca_bundle; fi; \
    npm --prefix tapioca-estacao-br ci --no-audit --no-fund \
 && npm --prefix lima-climatizacao ci --no-audit --no-fund \
 && npm --prefix lucas-construcoes ci --no-audit --no-fund \
 && npm --prefix movelaria-batel ci --no-audit --no-fund \
 && npm --prefix webforge ci --no-audit --no-fund
COPY tapioca-estacao-br/ ./tapioca-estacao-br/
COPY lima-climatizacao/ ./lima-climatizacao/
COPY lucas-construcoes/ ./lucas-construcoes/
COPY movelaria-batel/ ./movelaria-batel/
COPY webforge/ ./webforge/
RUN npm --prefix webforge run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=8080 DATA_DIR=/data PROTOTYPE_ROOT=/app/private/prototypes
WORKDIR /app
COPY --chown=node:node --from=build /app/webforge/package*.json ./
RUN --mount=type=secret,id=ca_bundle \
    if [ -f /run/secrets/ca_bundle ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/ca_bundle; fi; \
    npm ci --omit=dev --no-audit --no-fund \
 && npm cache clean --force \
 && mkdir -p /data \
 && chown node:node /data
COPY --chown=node:node --from=build /app/webforge/server ./server
COPY --chown=node:node --from=build /app/webforge/public ./public
COPY --chown=node:node --from=build /app/webforge/prototypes.json ./prototypes.json
COPY --chown=node:node --from=build /app/webforge/private ./private
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:8080/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","server/index.js"]
