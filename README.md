# 🛒 Grocery Genie

> AI-powered grocery intelligence platform for receipt processing, forecasting, and deal recommendations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green.svg)](https://fastapi.tiangolo.com/)

---

## Overview

Grocery Genie is an agentic AI platform that transforms how you manage grocery spending. It combines OCR-powered receipt scanning, LLM-based spend analysis, predictive forecasting, and real-time deal recommendations into a single intelligent system.

---

## Features

- **Receipt Processing** — Upload grocery receipts; OCR + LLM extraction parses items, prices, and categories automatically.
- **Spend Forecasting** — ML models predict future grocery spend based on historical patterns and seasonal trends.
- **Deal Recommendations** — Agents monitor local deals and match them against your purchase history.
- **Agentic Workflows** — LangGraph-powered agents for autonomous planning, comparison, and budget optimization.
- **MCP Server** — Model Context Protocol server exposing grocery data as tools for Claude and other LLMs.
- **Observability** — Full tracing, logging, and FinOps dashboards for LLM cost tracking.

---

## Architecture

```
grocery-genie/
├── frontend/          # Next.js 14 web app (App Router)
├── backend/           # FastAPI REST API + PostgreSQL
├── agents/            # LangGraph agentic workflows
├── mcp-server/        # Model Context Protocol server
├── ml/                # Forecasting & recommendation models
├── infra/             # Docker, Terraform, CI/CD configs
├── docs/              # Architecture diagrams & API docs
└── .github/workflows/ # GitHub Actions pipelines
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11, PostgreSQL |
| AI/Agents | LangGraph, Claude API, LangSmith |
| OCR | Tesseract / AWS Textract |
| ML | scikit-learn, Prophet, pandas |
| MCP | Model Context Protocol (Anthropic) |
| Infra | Docker, Docker Compose, GitHub Actions |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+

### Setup

```bash
# Clone the repo
git clone https://github.com/anithasomalinga/grocery-genie.git
cd grocery-genie

# Start all services
docker compose up --build
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## Roadmap

- [ ] Receipt upload & OCR pipeline
- [ ] Item categorization with LLM
- [ ] Spend dashboard (frontend)
- [ ] LangGraph deal-finder agent
- [ ] MCP server with grocery tools
- [ ] Forecasting model (Prophet)
- [ ] Push notifications for deals
- [ ] Multi-store price comparison

---

## License

MIT © [anithasomalinga](https://github.com/anithasomalinga)
