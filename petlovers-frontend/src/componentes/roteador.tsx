import React, { useState, useEffect, useCallback } from 'react';

// Componentes
import BarraNavegacao from "./barraNavegacao";
import ListaCliente from "./listaClientes";
import DetalhesCliente from "./detalhesCliente";
import Catalogo from "./catalogo";

// Formulários
import FormularioCadastroCliente from "./formularioCadastroCliente";
import FormularioEdicaoCliente from "./formularioEdicaoCliente";
import FormularioCadastroPet from "./formularioCadastroPet";
import FormularioEdicaoPet from "./formularioEdicaoPet";
import FormularioCadastroProduto from "./formularioCadastroProduto";
import FormularioEdicaoProduto from "./formularioEdicaoProduto";
import FormularioCadastroServico from "./formularioCadastroServico";
import FormularioEdicaoServico from "./formularioEdicaoServico";
import FormularioRegistroCompra from './formularioRegistroCompra';

// Relatórios
import RelatorioTopValor from "./relatorioTopValor";
import RelatorioTopQuantidade from "./relatorioTopQuantidade";
import RelatorioMaisConsumidos from "./relatorioMaisConsumidos";
import RelatorioConsumoPets from "./relatorioConsumoPets";

// Tipos e API
import { Cliente, Pet, Produto, Servico, CreatePet, CreateProduto, CreateServico, UpdatePet, UpdateProduto, UpdateServico, UpdateCliente } from "./dados";
import { apiClientes, apiProdutos, apiServicos, apiRegistros, apiRelatorios, apiPets } from '../api';

export default function Roteador() {
    const tema = "#6c757d";

    const [tela, setTela] = useState('Clientes');
    const [carregando, setCarregando] = useState(true);

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);

    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
    const [petSelecionado, setPetSelecionado] = useState<Pet | null>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);

    const [dadosRelatorio, setDadosRelatorio] = useState<any>(null);

    // --- LÓGICA DE CARREGAMENTO E NAVEGAÇÃO ---

    const carregarDadosGerais = useCallback(async () => {
        setCarregando(true);
        try {
            const [resClientes, resProdutos, resServicos] = await Promise.all([apiClientes.listar(), apiProdutos.listar(), apiServicos.listar()]);
            setClientes(resClientes.data);
            setProdutos(resProdutos.data);
            setServicos(resServicos.data);
        } catch (error) { console.error("Erro ao carregar dados:", error); } 
        finally { setCarregando(false); }
    }, []);

    useEffect(() => { carregarDadosGerais(); }, [carregarDadosGerais]);

    const selecionarView = async (novaTela: string) => {
        setTela(novaTela);
        if (novaTela.startsWith('Relatorio')) {
            setDadosRelatorio(null);
            try {
                if (novaTela === 'RelatorioTopValor') await apiRelatorios.topClientesValor().then(res => setDadosRelatorio(res.data));
                if (novaTela === 'RelatorioTopQuantidade') await apiRelatorios.topClientesQuantidade().then(res => setDadosRelatorio(res.data));
                if (novaTela === 'RelatorioMaisConsumidos') await apiRelatorios.maisConsumidos().then(res => setDadosRelatorio(res.data));
                if (novaTela === 'RelatorioConsumoPets') await apiRelatorios.consumoPets().then(res => setDadosRelatorio(res.data));
            } catch (error) { console.error(`Erro ao carregar relatório ${novaTela}:`, error); }
        }
    };
    
    const handleMostrarDetalhesCliente = async (clienteId: number) => {
        setTela('Carregando Detalhes');
        try {
            const res = await apiClientes.detalhes(clienteId);
            setClienteSelecionado(res.data);
            setTela('Detalhes Cliente');
        } catch (error) {
            console.error("Falha ao buscar detalhes do cliente", error);
            setTela('Clientes');
        }
    };

    // --- HANDLERS DE AÇÕES (CRUD) ---

    // PETS
    const handleSalvarPet = async (pet: CreatePet, donoId: number) => {
        await apiPets.criar(donoId, pet);
        // CORRIGIDO: Busca os detalhes do dono específico e navega para a tela dele
        await handleMostrarDetalhesCliente(donoId);
    };
    const handleAtualizarPet = async (pet: UpdatePet) => {
        await apiPets.atualizar(pet.id, pet);
        setPetSelecionado(null);
        if (clienteSelecionado?.id) {
            await handleMostrarDetalhesCliente(clienteSelecionado.id);
        }
    };
    const handleExcluirPet = async (pet: Pet) => {
        if (pet.id && window.confirm(`Excluir o pet ${pet.nome}?`)) {
            await apiPets.excluir(pet.id);
            if (clienteSelecionado?.id) {
                await handleMostrarDetalhesCliente(clienteSelecionado.id);
            }
        }
    };

    // PRODUTOS
    const handleSalvarProduto = async (produto: CreateProduto | UpdateProduto) => {
        if ('id' in produto) {
            await apiProdutos.atualizar(produto.id!, produto);
        } else {
            await apiProdutos.criar(produto);
        }
        setProdutoSelecionado(null);
        setTela('Catálogo');
        await carregarDadosGerais();
    };
    const handleExcluirProduto = async (produto: Produto) => {
        if (produto.id && window.confirm(`Excluir o produto ${produto.nome}?`)) {
            await apiProdutos.excluir(produto.id);
            await carregarDadosGerais();
        }
    };

    // SERVIÇOS
    const handleSalvarServico = async (servico: CreateServico | UpdateServico) => {
        if ('id' in servico) {
            await apiServicos.atualizar(servico.id!, servico);
        } else {
            await apiServicos.criar(servico);
        }
        setServicoSelecionado(null);
        setTela('Catálogo');
        await carregarDadosGerais();
    };
    const handleExcluirServico = async (servico: Servico) => {
        if (servico.id && window.confirm(`Excluir o serviço ${servico.nome}?`)) {
            await apiServicos.excluir(servico.id);
            await carregarDadosGerais();
        }
    };


    // --- RENDERIZAÇÃO ---
    const renderizarConteudo = () => {
        if (carregando || tela === 'Carregando Detalhes') {
            return <div className="text-center mt-5"><div className="spinner-border" /></div>;
        }

        // Renderização de Modais de Edição
        if (petSelecionado) return <FormularioEdicaoPet tema={tema} pet={petSelecionado} onSalvar={handleAtualizarPet} onCancelar={() => setPetSelecionado(null)} />;
        if (produtoSelecionado) return <FormularioEdicaoProduto tema={tema} produto={produtoSelecionado} onSalvar={handleSalvarProduto} onCancelar={() => setProdutoSelecionado(null)} />;
        if (servicoSelecionado) return <FormularioEdicaoServico tema={tema} servico={servicoSelecionado} onSalvar={handleSalvarServico} onCancelar={() => setServicoSelecionado(null)} />;

        switch (tela) {
            case 'Clientes':
                return <ListaCliente tema={tema} clientes={clientes} onDetalhes={(c) => handleMostrarDetalhesCliente(c.id!)} onEditar={(c) => { setClienteSelecionado(c); setTela('Editar Cliente'); }} onExcluir={async (c) => { if(c.id && window.confirm(`Excluir ${c.nome}?`)) await apiClientes.excluir(c.id); carregarDadosGerais(); }} />;
            
            case 'Catálogo':
                return <Catalogo tema={tema} produtos={produtos} servicos={servicos} onEditarProduto={setProdutoSelecionado} onExcluirProduto={handleExcluirProduto} onEditarServico={setServicoSelecionado} onExcluirServico={handleExcluirServico} />;
            
            case 'Detalhes Cliente':
                return clienteSelecionado && <DetalhesCliente tema={tema} cliente={clienteSelecionado} onFechar={() => setTela('Clientes')} onCadastrarPet={() => setTela('Cadastrar Pet')} onIniciarEdicaoPet={setPetSelecionado} onExcluirPet={handleExcluirPet} />;
            
            case 'Cadastrar Cliente':
                return <FormularioCadastroCliente tema={tema} onClienteCadastrado={() => { carregarDadosGerais(); setTela('Clientes'); }} />;
            case 'Editar Cliente':
                return clienteSelecionado && <FormularioEdicaoCliente tema={tema} cliente={clienteSelecionado} onSalvar={async (c) => { if(c.id) await apiClientes.atualizar(c.id, c); carregarDadosGerais(); setTela('Clientes'); }} onFechar={() => setTela('Clientes')} />;
            
            case 'Cadastrar Pet':
                return <FormularioCadastroPet tema={tema} cliente={clienteSelecionado} clientes={clientes} onSubmit={handleSalvarPet} />;
            
            case 'Cadastrar Produto':
                return <FormularioCadastroProduto tema={tema} onSubmit={handleSalvarProduto} />;
            case 'Cadastrar Serviço':
                return <FormularioCadastroServico tema={tema} onSubmit={handleSalvarServico} />;
            
            case 'Registrar Compra':
                return <FormularioRegistroCompra tema={tema} clientes={clientes} produtos={produtos} servicos={servicos} onSubmit={async (payload) => { await apiRegistros.registrarCompra(payload); carregarDadosGerais(); setTela('Clientes'); }} onCancelar={() => setTela('Clientes')} />;
            
            // Relatórios
            case 'RelatorioTopValor':
                return dadosRelatorio ? <RelatorioTopValor tema={tema} dados={dadosRelatorio} /> : <div>Carregando...</div>;
            case 'RelatorioTopQuantidade':
                return dadosRelatorio ? <RelatorioTopQuantidade tema={tema} dados={dadosRelatorio} /> : <div>Carregando...</div>;
            case 'RelatorioMaisConsumidos':
                return dadosRelatorio ? <RelatorioMaisConsumidos tema={tema} dados={dadosRelatorio} /> : <div>Carregando...</div>;
            case 'RelatorioConsumoPets':
                return dadosRelatorio ? <RelatorioConsumoPets tema={tema} dados={dadosRelatorio} /> : <div>Carregando...</div>;
                
            default:
                return <ListaCliente tema={tema} clientes={clientes} onDetalhes={(c) => handleMostrarDetalhesCliente(c.id!)} onEditar={(c) => { setClienteSelecionado(c); setTela('Editar Cliente'); }} onExcluir={async (c) => { if(c.id && window.confirm(`Excluir ${c.nome}?`)) await apiClientes.excluir(c.id); carregarDadosGerais(); }} />;
        }
    };
    
    return (
        <>
            <BarraNavegacao seletorView={selecionarView} tema={tema} />
            <div className="container mt-4">
                {renderizarConteudo()}
            </div>
        </>
    );
}