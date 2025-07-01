import React from 'react';

// Tipos atualizados para refletir os novos dados da API
type ConsumoPorRaca = {
    raca: string;
    valorProdutos: number;
    quantidadeProdutos: number;
    valorServicos: number;
    quantidadeServicos: number;
};

type ConsumoPorTipo = {
    tipo: string;
    valorProdutos: number;
    quantidadeProdutos: number;
    valorServicos: number;
    quantidadeServicos: number;
    racas: ConsumoPorRaca[];
};

type Props = {
    tema: string;
    dados: ConsumoPorTipo[];
}

export default function RelatorioConsumoPets(props: Props) {
    const { tema, dados } = props;

    if (!dados) return <div>Carregando relatório...</div>;

    if (dados.length === 0) {
        return (
            <div className="card border-0 shadow-sm">
                <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                    <h5 className="mb-0 fw-bold"><i className="bi bi-pie-chart-fill me-2"></i>Consumo por Pet</h5>
                </div>
                <div className="card-body text-center text-muted">
                    <p className="mt-3">Nenhum dado de consumo encontrado para gerar este relatório.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header py-3" style={{ backgroundColor: tema, color: 'white' }}>
                <h5 className="mb-0 fw-bold">
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Relatório de Consumo por Tipo e Raça de Pet
                </h5>
            </div>

            <div className="accordion" id="relatorioAccordion">
                {dados.map((dadosTipo, index) => (
                    <div className="accordion-item border-0 border-bottom" key={index}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed shadow-none"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                            >
                                <div className="d-flex justify-content-between w-100 pe-3 flex-wrap">
                                    <strong className="me-3">{dadosTipo.tipo}</strong>
                                    {/* Exibindo os totais separados por tipo */}
                                    <div className="d-flex gap-2 flex-wrap">
                                        <span className="badge bg-primary">
                                            Produtos: R$ {dadosTipo.valorProdutos.toFixed(2)} ({dadosTipo.quantidadeProdutos} un)
                                        </span>
                                        <span className="badge bg-info text-dark">
                                            Serviços: R$ {dadosTipo.valorServicos.toFixed(2)} ({dadosTipo.quantidadeServicos} un)
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#relatorioAccordion"
                        >
                            <div className="accordion-body">
                                <ul className="list-group">
                                    {dadosTipo.racas.map((dadosRaca, racaIndex) => (
                                        <li key={racaIndex} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                <span className="fw-semibold me-3">{dadosRaca.raca}</span>
                                                {/* Exibindo os totais separados por raça */}
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <small className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill">
                                                        Produtos: R$ {dadosRaca.valorProdutos.toFixed(2)} ({dadosRaca.quantidadeProdutos} un)
                                                    </small>
                                                    <small className="badge bg-info-subtle border border-info-subtle text-info-emphasis rounded-pill">
                                                        Serviços: R$ {dadosRaca.valorServicos.toFixed(2)} ({dadosRaca.quantidadeServicos} un)
                                                    </small>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}