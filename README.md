# Stark Bank — Back-end Developer Trial

Integração com a API do Stark Bank que gera faturas automaticamente e processa pagamentos via webhook, transferindo os valores recebidos para a conta da Stark Bank S.A.

## Funcionalidades

- Cria entre 8 e 12 invoices aleatórias a cada 3 horas por 24 horas
- Recebe webhooks do Stark Bank e valida a assinatura ECDSA
- Ao detectar pagamento, transfere o valor líquido para a Stark Bank S.A.
- Dashboard web em tempo real com feed de webhooks via Server-Sent Events

## Stack

- **Node.js 22** + **TypeScript**
- **Express** — servidor HTTP e webhook
- **node-cron** — agendamento do job de invoices
- **Stark Bank Node.js SDK**

---

## Rodando localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o exemplo e preencha com suas credenciais do sandbox:

```bash
cp .env.example .env
```

```env
STARKBANK_PROJECT_ID=seu-project-id
STARKBANK_PRIVATE_KEY="-----BEGIN EC PARAMETERS-----
...
-----END EC PRIVATE KEY-----"
STARKBANK_ENVIRONMENT=sandbox
PORT=3000
```

### 3. Rodar

```bash
npm run dev
```

Acesse o dashboard em **http://localhost:3000**

### 4. Expor o webhook com ngrok

Em outro terminal:

```bash
ngrok http 3000
```

Copie a URL gerada (ex: `https://abc123.ngrok-free.app`) e cadastre no dashboard do Stark Bank:

> **Configurações → Integrações → Webhooks → Novo Webhook**
> - URL: `https://abc123.ngrok-free.app/webhook`
> - Assinatura: `invoice`

---

## Deploy no Google Cloud Run

O Cloud Run fornece uma URL HTTPS permanente — sem necessidade de ngrok.

### Pré-requisitos

```bash
# Instalar Google Cloud CLI
brew install google-cloud-sdk   # macOS

# Autenticar
gcloud auth login
gcloud config set project SEU_PROJECT_ID
```

### Deploy

```bash
# Build e push da imagem
gcloud builds submit --tag gcr.io/SEU_PROJECT_ID/stark-bank

# Deploy no Cloud Run
gcloud run deploy stark-bank \
  --image gcr.io/SEU_PROJECT_ID/stark-bank \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --set-env-vars "STARKBANK_PROJECT_ID=seu-id" \
  --set-env-vars "STARKBANK_ENVIRONMENT=sandbox" \
  --set-env-vars "STARKBANK_PRIVATE_KEY=-----BEGIN EC PARAMETERS-----
...
-----END EC PRIVATE KEY-----"
```

> `--min-instances 1` é obrigatório para o cron job continuar rodando. Sem isso o container hiberna e as execuções de 3 em 3 horas param.

Após o deploy, a URL será exibida:
```
Service URL: https://stark-bank-xxxx-uc.a.run.app
```

Cadastre no Stark Bank:
- **URL do webhook:** `https://stark-bank-xxxx-uc.a.run.app/webhook`

### Variáveis de ambiente no Cloud Run

Nunca suba o `.env` para a imagem. Passe as credenciais como variáveis de ambiente no deploy (conforme o comando acima) ou pelo console do GCP em:

> **Cloud Run → seu serviço → Editar → Variáveis de ambiente**

---

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Desenvolvimento com hot-reload |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda o build compilado |
| `npm test` | Executa os testes unitários |
| `npm run test:coverage` | Testes com relatório de cobertura |

---

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/webhook` | Recebe eventos do Stark Bank |
| `GET` | `/api/balance` | Saldo atual da conta |
| `GET` | `/api/invoices` | Últimas 20 invoices |
| `POST` | `/api/invoices/batch` | Força criação de novo lote |
| `GET` | `/api/events` | Stream SSE para o dashboard |
| `GET` | `/` | Dashboard web |

---

## Testes

```bash
npm test
```

```
Test Suites: 2 passed
Tests:       8 passed
```

Cobertura inclui `getRandomPeople`, `randomBetween` e `transferInvoiceCredit`.

---

## Estrutura do Projeto

```
src/
├── index.ts                  # Ponto de entrada
├── config/starkbank.ts       # Autenticação SDK
├── jobs/invoice.job.ts       # Cron a cada 3h
├── services/
│   ├── invoice.service.ts    # Criação de invoices
│   └── transfer.service.ts   # Transferência pós-pagamento
├── webhook/server.ts         # Receptor de webhooks
├── api/
│   ├── router.ts             # REST API do dashboard
│   └── sse.ts                # Server-Sent Events
└── utils/people.ts           # Pool de pessoas fictícias
public/
└── index.html                # Dashboard
```

Para documentação detalhada da arquitetura, veja [ARCHITECTURE.md](ARCHITECTURE.md).
