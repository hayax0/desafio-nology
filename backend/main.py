import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor

# em produção usamos variaveis de ambiente, mas como é teste, o fallback fica direto na string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:10092004CaioPecinha%40@db.inytwsztovvuktcigxiy.supabase.co:5432/postgres")

app = FastAPI(title="Nology Cashback API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CashbackPayload(BaseModel):
    valor_compra: float
    cupom_desconto_pct: float
    is_vip: bool

def calcular_cashback(valor_compra: float, desconto_pct: float, is_vip: bool) -> dict:
    valor_final = valor_compra * (1 - (desconto_pct / 100))
    
    pct_cashback = 0.10 if valor_final > 500.00 else 0.05
    cashback_base = valor_final * pct_cashback
    bonus_vip = cashback_base * 0.10 if is_vip else 0.0

    return {
        "valor_final_compra": round(valor_final, 2),
        "cashback_base": round(cashback_base, 2),
        "bonus_vip": round(bonus_vip, 2),
        "cashback_total": round(cashback_base + bonus_vip, 2)
    }

@app.on_event("startup")
def setup_database():
    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS historico_consultas (
                        id SERIAL PRIMARY KEY,
                        ip_usuario VARCHAR(50),
                        tipo_cliente VARCHAR(20),
                        valor_compra NUMERIC(10, 2),
                        cashback_gerado NUMERIC(10, 2),
                        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
    except Exception as e:
        print(f"Startup warning - DB Connection failed: {e}")

@app.post("/calcular")
def processar_cashback(payload: CashbackPayload, request: Request):
    ip_cliente = request.client.host
    tipo_cliente = "VIP" if payload.is_vip else "Normal"
    
    resultado = calcular_cashback(
        payload.valor_compra,
        payload.cupom_desconto_pct,
        payload.is_vip
    )

    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute('''
                    INSERT INTO historico_consultas (ip_usuario, tipo_cliente, valor_compra, cashback_gerado)
                    VALUES (%s, %s, %s, %s)
                ''', (ip_cliente, tipo_cliente, payload.valor_compra, resultado["cashback_total"]))
                
                cursor.execute('''
                    SELECT tipo_cliente, valor_compra, cashback_gerado, TO_CHAR(data_hora, 'DD/MM/YYYY HH24:MI') as data
                    FROM historico_consultas
                    WHERE ip_usuario = %s
                    ORDER BY id DESC
                ''', (ip_cliente,))
                
                historico = cursor.fetchall()
                
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro interno ao conectar com o banco de dados.")

    return {
        "calculo_atual": resultado,
        "historico": historico
    }