"use client";

import { useState } from "react";

interface CalculoAtual {
  valor_final_compra: number;
  cashback_base: number;
  bonus_vip: number;
  cashback_total: number;
}

interface HistoricoItem {
  tipo_cliente: string;
  valor_compra: number;
  cashback_gerado: number;
  data: string;
}

export default function Home() {
  const [valorCompra, setValorCompra] = useState("");
  const [cupomPct, setCupomPct] = useState("0");
  const [isVip, setIsVip] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<CalculoAtual | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Bate na nossa API Python rodando localmente
      const response = await fetch("http://127.0.0.1:8000/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor_compra: parseFloat(valorCompra),
          cupom_desconto_pct: parseFloat(cupomPct),
          is_vip: isVip,
        }),
      });

      const data = await response.json();
      setResultado(data.calculo_atual);
      setHistorico(data.historico);
    } catch (error) {
      alert("Erro ao conectar com a API. O backend em Python está rodando?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mt-10">
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Nology Cashback
          </h1>
          <p className="text-zinc-400">
            Simulador de benefícios e histórico de consultas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LADO ESQUERDO: Formulário e Resultado */}
          <div className="flex flex-col gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 border-b border-zinc-800 pb-2">
                Nova Consulta
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Valor da Compra (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valorCompra}
                    onChange={(e) => setValorCompra(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ex: 600.00"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Cupom de Desconto (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={cupomPct}
                    onChange={(e) => setCupomPct(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ex: 20"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="vip"
                    checked={isVip}
                    onChange={(e) => setIsVip(e.target.checked)}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer"
                  />
                  <label
                    htmlFor="vip"
                    className="text-sm cursor-pointer select-none"
                  >
                    Cliente é VIP?
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Calculando..." : "Calcular Cashback"}
                </button>
              </form>
            </div>

            {/* Card de Resultado */}
            {resultado && (
              <div className="bg-indigo-950/30 border border-indigo-900/50 p-6 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-lg font-semibold text-indigo-300 mb-3">
                  Resultado Atual
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Valor Final (c/ desconto):
                    </span>
                    <span className="font-mono">
                      R$ {resultado.valor_final_compra.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Cashback Base:</span>
                    <span className="font-mono">
                      R$ {resultado.cashback_base.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Bônus VIP:</span>
                    <span className="font-mono text-green-400">
                      + R$ {resultado.bonus_vip.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-indigo-900/50 text-base font-bold text-white">
                    <span>Cashback Total:</span>
                    <span className="font-mono text-indigo-400">
                      R$ {resultado.cashback_total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* LADO DIREITO: Histórico */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg flex flex-col max-h-[600px]">
            <h2 className="text-xl font-semibold mb-4 border-b border-zinc-800 pb-2">
              Seu Histórico (IP Atual)
            </h2>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-3">
              {historico.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center mt-10">
                  Nenhuma consulta realizada ainda.
                </p>
              ) : (
                historico.map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${item.tipo_cliente === "VIP" ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-300"}`}
                      >
                        {item.tipo_cliente}
                      </span>
                      <span className="text-xs text-zinc-500">{item.data}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Compra:</span>
                      <span className="font-mono">
                        R$ {Number(item.valor_compra).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Cashback:</span>
                      <span className="font-mono text-green-400 font-medium">
                        R$ {Number(item.cashback_gerado).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
