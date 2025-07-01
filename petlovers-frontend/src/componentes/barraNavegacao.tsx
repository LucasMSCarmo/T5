import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

type Props = {
    tema: string;
    seletorView: (novaTela: string) => void;
}

export default function BarraNavegacao(props: Props) {
    const { tema, seletorView } = props;

    const handleNavClick = (tela: string, e: React.MouseEvent) => {
        e.preventDefault();
        seletorView(tela);
        const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
        if (toggler && getComputedStyle(toggler).display !== 'none') {
            toggler.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: tema }}>
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="#" onClick={(e) => handleNavClick('Clientes', e)}><i className="bi bi-heart-fill me-2"></i>PetLovers</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item mx-1"><a className="nav-link py-2 px-3 rounded-2" href="#" onClick={(e) => handleNavClick('Clientes', e)}><i className="bi bi-people-fill me-2"></i>Clientes & Pets</a></li>
                        <li className="nav-item mx-1"><a className="nav-link py-2 px-3 rounded-2" href="#" onClick={(e) => handleNavClick('Registrar Compra', e)}><i className="bi bi-cart-plus me-2"></i>Registrar Compra</a></li>
                        <li className="nav-item mx-1"><a className="nav-link py-2 px-3 rounded-2" href="#" onClick={(e) => handleNavClick('Catálogo', e)}><i className="bi bi-journal-album me-2"></i>Catálogo</a></li>
                        <li className="nav-item dropdown mx-1">
                            <a className="nav-link dropdown-toggle py-2 px-3 rounded-2" href="#" role="button" data-bs-toggle="dropdown"><i className="bi bi-file-earmark-bar-graph-fill me-2"></i>Relatórios</a>
                            <ul className="dropdown-menu shadow-sm border-0">
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('RelatorioTopValor', e)}><i className="bi bi-trophy-fill me-2" style={{ color: tema }}></i>Top Clientes (Valor)</a></li>
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('RelatorioTopQuantidade', e)}><i className="bi bi-graph-up-arrow me-2" style={{ color: tema }}></i>Top Clientes (Quantidade)</a></li>
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('RelatorioMaisConsumidos', e)}><i className="bi bi-star-fill me-2" style={{ color: tema }}></i>Itens Mais Consumidos</a></li>
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('RelatorioConsumoPets', e)}><i className="bi bi-pie-chart-fill me-2" style={{ color: tema }}></i>Consumo por Pet</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown mx-1">
                            <a className="nav-link dropdown-toggle py-2 px-3 rounded-2" href="#" role="button" data-bs-toggle="dropdown"><i className="bi bi-file-earmark-plus me-2"></i>Cadastros</a>
                            <ul className="dropdown-menu shadow-sm border-0">
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('Cadastrar Cliente', e)}><i className="bi bi-person-plus me-2" style={{ color: tema }}></i>Cliente</a></li>
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('Cadastrar Pet', e)}><i className="bi bi-heart me-2" style={{ color: tema }}></i>Pet</a></li>
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('Cadastrar Produto', e)}><i className="bi bi-cart-plus me-2" style={{ color: tema }}></i>Produto</a></li>
                                <li><a className="dropdown-item py-2 px-3" href="#" onClick={(e) => handleNavClick('Cadastrar Serviço', e)}><i className="bi bi-scissors me-2" style={{ color: tema }}></i>Serviço</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}