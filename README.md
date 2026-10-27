# Feira de Ciências: El Niño

Aplicação interativa sobre o fenômeno El Niño, com quiz e ranking persistido em SQLite.

## Desenvolvimento local

Requisitos: Bun e uma chave da API Gemini.

1. Instale as dependências com `bun install --frozen-lockfile`.
2. Configure `GEMINI_API_KEY` no arquivo `.env.local`.
3. Inicie o servidor com `bun run dev`.

## Docker

Crie e inicie a aplicação com `docker compose up --build -d`. A aplicação fica disponível em `http://localhost:3000`, e os dados SQLite são persistidos em `./data`.

## Publicar no GitHub Container Registry

O workflow em `.github/workflows/ci-cd.yml` testa e publica automaticamente no GHCR quando há push para `main`. Ele gera as tags `latest` e o SHA curto do commit. O workflow usa `GITHUB_TOKEN`; confirme que a configuração de Actions do repositório permite escrita de pacotes.

Para publicar manualmente, use um token do GitHub com permissão `write:packages`:

```sh
docker build -t ghcr.io/OWNER/REPOSITORY:latest .
echo "$GH_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin
docker push ghcr.io/OWNER/REPOSITORY:latest
```

Substitua `OWNER` e `REPOSITORY` pelo proprietário e nome do repositório. Para iniciar a imagem publicada, configure `image: ghcr.io/OWNER/REPOSITORY:latest` no Compose, mantendo a porta `3000` e o volume `/app/data`.
