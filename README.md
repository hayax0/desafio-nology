# Link do Projeto Online
https://nology-cashback-caio.vercel.app/

# Nology Cashback API & Dashboard

Este projeto foi desenvolvido como resolução do desafio técnico Full Stack para a Nology.
O sistema é composto por uma API para o cálculo de benefícios e um painel Web para interação e consulta de histórico, com persistência de dados em nuvem.

## Stack Tecnológica

- **Backend:** Python, FastAPI, Uvicorn, Psycopg2.
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS v4.
- **Database:** PostgreSQL (Hospedado via Supabase).

## Funcionalidades Implementadas

- **Motor de Regras (Questões 1 a 4):** Cálculo dinâmico de cashback baseado no valor da compra e no tipo de cliente (Normal/VIP), com suporte a aplicação prévia de cupons de desconto.
- **Dashboard Interativo (Questão 5):** Interface minimalista construída com Tailwind CSS para simular compras.
- **Persistência de Dados (Questão 5):** Registro de cada consulta no banco de dados, vinculando os cálculos ao IP do usuário para exibição de histórico personalizado na tela.

## Como rodar o projeto localmente

Para o sistema funcionar, é necessário rodar o Backend e o Frontend simultaneamente em terminais separados.

### 1. Configurando o Backend (API)

Navegue até a pasta `backend`, crie seu ambiente virtual e instale as dependências:

```bash
cd backend
python -m venv .venv

# Ative o ambiente virtual (Windows)
.\.venv\Scripts\activate
# Ou no Linux/Mac: source .venv/bin/activate

# Instale as bibliotecas
pip install fastapi uvicorn psycopg2-binary python-dotenv pydantic

⚠️ Importante: Crie um arquivo .env dentro da pasta backend contendo a string de conexão do banco:
DATABASE_URL=sua_url_do_postgres_aqui

Com tudo configurado, levante o servidor da API:

Bash
uvicorn main:app --reload
A API ficará escutando em http://127.0.0.1:8000.

### 2. Configurando o Frontend (Interface)
Abra uma nova aba no terminal, navegue até a pasta `frontend` e rode o Next.js:

```bash
cd frontend
npm install
npm run dev
Acesse http://localhost:3000 no navegador para utilizar a calculadora.

Desenvolvido por Caio Campos.
