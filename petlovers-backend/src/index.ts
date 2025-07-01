import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// ------------------- INICIALIZAÇÃO -------------------
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

// ------------------- FUNÇÕES AUXILIARES DE NEGÓCIO -------------------

/**
 * Calcula o consumo de todos os clientes de forma segura.
 * @returns Uma promessa que resolve para um array de clientes com seus dados de consumo.
 */
const calcularConsumoClientes = async () => {
    const clientes = await prisma.cliente.findMany({
        include: {
            pets: {
                include: {
                    produtosConsumidos: { select: { quantidade: true, produto: { select: { preco: true } } } },
                    servicosConsumidos: { select: { servico: { select: { preco: true } } } }
                }
            }
        }
    });

    return clientes.map(cliente => {
        let valorProdutos = 0, qtdProdutos = 0, valorServicos = 0, qtdServicos = 0;
        cliente.pets.forEach(pet => {
            pet.produtosConsumidos.forEach(consumo => {
                valorProdutos += (consumo.produto?.preco || 0) * consumo.quantidade;
                qtdProdutos += consumo.quantidade;
            });
            pet.servicosConsumidos.forEach(consumo => {
                valorServicos += consumo.servico?.preco || 0;
                qtdServicos += 1;
            });
        });

        return {
            id: cliente.id,
            nomeCliente: cliente.nome,
            valorProdutos,
            qtdProdutos,
            valorServicos,
            qtdServicos,
            valorGeral: valorProdutos + valorServicos,
            qtdGeral: qtdProdutos + qtdServicos
        };
    });
};


// ------------------- ROTAS DE CLIENTES -------------------

// Listar todos os clientes
app.get('/api/clientes', async (req: Request, res: Response) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: { pets: true, rgs: true, telefones: true },
        });
        res.status(200).json(clientes);
    } catch (error) {
        console.error("Erro ao listar clientes:", error);
        res.status(500).json({ error: 'Não foi possível buscar os clientes.' });
    }
});

// Obter detalhes de um cliente específico
app.get('/api/clientes/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(id) },
            include: {
                pets: { include: { produtosConsumidos: { include: { produto: true } }, servicosConsumidos: { include: { servico: true } } } },
                rgs: true,
                telefones: true,
            },
        });
        res.status(200).json(cliente);
    } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        res.status(500).json({ error: 'Falha ao buscar detalhes do cliente.' });
    }
});

// Cadastrar novo cliente
app.post('/api/clientes', async (req: Request, res: Response) => {
    try {
        const { rgs, pets, telefones, ...dadosCliente } = req.body;
        const novoCliente = await prisma.cliente.create({
            data: {
                ...dadosCliente,
                telefones: { create: telefones },
                rgs: { create: rgs },
                pets: { create: pets },
            },
            include: { pets: true, rgs: true, telefones: true },
        });
        res.status(201).json(novoCliente);
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        res.status(500).json({ error: 'Falha ao cadastrar cliente. Verifique se o CPF ou Email já existem.' });
    }
});

// Atualizar um cliente
app.put('/api/clientes/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rgs, telefones, ...dadosCliente } = req.body;
        
        await prisma.$transaction(async (tx) => {
            await tx.rG.deleteMany({ where: { clienteId: parseInt(id) } });
            await tx.telefone.deleteMany({ where: { clienteId: parseInt(id) } });

            await tx.cliente.update({
                where: { id: parseInt(id) },
                data: {
                    ...dadosCliente,
                    rgs: { create: rgs.map((rg: { numero: string; dataEmissao: string; }) => ({ numero: rg.numero, dataEmissao: rg.dataEmissao })) },
                    telefones: { create: telefones.map((tel: { numero: string; }) => ({ numero: tel.numero })) }
                }
            });
        });
        res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ error: 'Falha ao atualizar cliente.' });
    }
});

// Deletar um cliente
app.delete('/api/clientes/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Transação para deletar tudo relacionado ao cliente
        await prisma.$transaction(async (tx) => {
            const pets = await tx.pet.findMany({ where: { clienteId: parseInt(id) }});
            const petIds = pets.map(p => p.id);

            await tx.produtoConsumido.deleteMany({ where: { petId: { in: petIds } } });
            await tx.servicoConsumido.deleteMany({ where: { petId: { in: petIds } } });
            await tx.pet.deleteMany({ where: { id: { in: petIds } } });
            await tx.rG.deleteMany({ where: { clienteId: parseInt(id) } });
            await tx.telefone.deleteMany({ where: { clienteId: parseInt(id) } });
            await tx.cliente.delete({ where: { id: parseInt(id) } });
        });
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        res.status(500).json({ error: 'Falha ao deletar cliente.' });
    }
});

// ------------------- ROTAS DE PETS -------------------

// Adicionar um pet a um cliente
app.post('/api/clientes/:clienteId/pets', async (req: Request, res: Response) => {
    try {
        const { clienteId } = req.params;
        const pet = await prisma.pet.create({
            data: { ...req.body, clienteId: parseInt(clienteId) }
        });
        res.status(201).json(pet);
    } catch (error) {
        console.error("Erro ao adicionar pet:", error);
        res.status(500).json({ error: 'Falha ao adicionar pet.' });
    }
});

// Atualizar um pet
app.put('/api/pets/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pet = await prisma.pet.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json(pet);
    } catch (error) {
        console.error("Erro ao atualizar pet:", error);
        res.status(500).json({ error: 'Falha ao atualizar pet.' });
    }
});

// Deletar um pet
app.delete('/api/pets/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.$transaction([
            prisma.produtoConsumido.deleteMany({ where: { petId: parseInt(id) } }),
            prisma.servicoConsumido.deleteMany({ where: { petId: parseInt(id) } }),
            prisma.pet.delete({ where: { id: parseInt(id) } })
        ]);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar pet:", error);
        res.status(500).json({ error: 'Falha ao deletar pet.' });
    }
});

// ------------------- ROTAS DE PRODUTOS -------------------

// Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar produtos.' });
    }
});

// Cadastrar novo produto
app.post('/api/produtos', async (req, res) => {
    try {
        const novoProduto = await prisma.produto.create({ data: req.body });
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao cadastrar produto.' });
    }
});

// Atualizar um produto
app.put('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produtoAtualizado = await prisma.produto.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao atualizar produto.' });
    }
});

// Deletar um produto
app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.produto.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Falha ao deletar produto.' });
    }
});

// ------------------- ROTAS DE SERVIÇOS -------------------

// Listar todos os serviços
app.get('/api/servicos', async (req, res) => {
    try {
        const servicos = await prisma.servico.findMany();
        res.status(200).json(servicos);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar serviços.' });
    }
});

// Cadastrar novo serviço
app.post('/api/servicos', async (req, res) => {
    try {
        const novoServico = await prisma.servico.create({ data: req.body });
        res.status(201).json(novoServico);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao cadastrar serviço.' });
    }
});

// Atualizar um serviço
app.put('/api/servicos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const servicoAtualizado = await prisma.servico.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(servicoAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao atualizar serviço.' });
    }
});

// Deletar um serviço
app.delete('/api/servicos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.servico.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Falha ao deletar serviço.' });
    }
});

// ------------------- ROTA DE AÇÕES -------------------

// Registrar uma compra (consumo de produtos/serviços)
app.post('/api/registrar-compra', async (req: Request, res: Response) => {
    const { petId, produtos, servicos } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            if (produtos && produtos.length > 0) {
                await tx.produtoConsumido.createMany({
                    data: produtos.map((p: { produtoId: number; quantidade: number; }) => ({
                        petId: petId,
                        produtoId: p.produtoId,
                        quantidade: p.quantidade,
                    }))
                });
            }
            if (servicos && servicos.length > 0) {
                await tx.servicoConsumido.createMany({
                    data: servicos.map((s: { servicoId: number; }) => ({
                        petId: petId,
                        servicoId: s.servicoId,
                    }))
                });
            }
        });
        res.status(201).json({ message: 'Compra registrada com sucesso!' });
    } catch (error) {
        console.error("Erro ao registrar compra:", error);
        res.status(500).json({ error: 'Falha ao registrar a compra.' });
    }
});


// ------------------- ROTAS DE RELATÓRIOS -------------------

// Rota: Top Clientes (ranking triplo por VALOR)
app.get('/api/relatorios/top-clientes-valor', async (req: Request, res: Response) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                pets: {
                    include: {
                        produtosConsumidos: { select: { quantidade: true, produto: { select: { preco: true } } } },
                        servicosConsumidos: { select: { servico: { select: { preco: true } } } }
                    }
                }
            }
        });

        const consumo = clientes.map(c => {
            let valorProdutos = 0, qtdProdutos = 0, valorServicos = 0, qtdServicos = 0;
            c.pets.forEach(p => {
                p.produtosConsumidos.forEach(consumo => {
                    valorProdutos += consumo.produto.preco * consumo.quantidade;
                    qtdProdutos += consumo.quantidade;
                });
                p.servicosConsumidos.forEach(consumo => {
                    valorServicos += consumo.servico.preco;
                    qtdServicos += 1;
                });
            });
            return {
                nomeCliente: c.nome,
                valorProdutos,
                qtdProdutos,
                valorServicos,
                qtdServicos,
                valorGeral: valorProdutos + valorServicos,
                qtdGeral: qtdProdutos + qtdServicos
            };
        });

        // Ordena por cada critério de VALOR
        const topProdutos = [...consumo].sort((a, b) => b.valorProdutos - a.valorProdutos).slice(0, 5);
        const topServicos = [...consumo].sort((a, b) => b.valorServicos - a.valorServicos).slice(0, 5);
        const topGeral = [...consumo].sort((a, b) => b.valorGeral - a.valorGeral).slice(0, 5);

        res.json({ topProdutos, topServicos, topGeral });
    } catch (error) {
        console.error("Erro no relatório Top Clientes (Valor):", error);
        res.status(500).json({ error: 'Falha ao gerar relatório.' });
    }
});

// Rota: Top Clientes (ranking triplo por QUANTIDADE)
app.get('/api/relatorios/top-clientes-quantidade', async (req: Request, res: Response) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                pets: {
                    include: {
                        produtosConsumidos: { select: { quantidade: true, produto: { select: { preco: true } } } },
                        servicosConsumidos: { select: { servico: { select: { preco: true } } } }
                    }
                }
            }
        });

        const consumo = clientes.map(c => {
            let valorProdutos = 0, qtdProdutos = 0, valorServicos = 0, qtdServicos = 0;
            c.pets.forEach(p => {
                p.produtosConsumidos.forEach(consumo => {
                    valorProdutos += consumo.produto.preco * consumo.quantidade;
                    qtdProdutos += consumo.quantidade;
                });
                p.servicosConsumidos.forEach(consumo => {
                    valorServicos += consumo.servico.preco;
                    qtdServicos += 1;
                });
            });
            return {
                nomeCliente: c.nome,
                valorProdutos,
                qtdProdutos,
                valorServicos,
                qtdServicos,
                valorGeral: valorProdutos + valorServicos,
                qtdGeral: qtdProdutos + qtdServicos
            };
        });

        // Ordena por cada critério de QUANTIDADE
        const topProdutos = [...consumo].sort((a, b) => b.qtdProdutos - a.qtdProdutos).slice(0, 5);
        const topServicos = [...consumo].sort((a, b) => b.qtdServicos - a.qtdServicos).slice(0, 5);
        const topGeral = [...consumo].sort((a, b) => b.qtdGeral - a.qtdGeral).slice(0, 5);

        res.json({ topProdutos, topServicos, topGeral });
    } catch (error) {
        console.error("Erro no relatório Top Clientes (Quantidade):", error);
        res.status(500).json({ error: 'Falha ao gerar relatório.' });
    }
});

// Rota: Itens mais consumidos
app.get('/api/relatorios/mais-consumidos', async (req: Request, res: Response) => {
    try {
        const produtosInfo = await prisma.produto.findMany();
        const consumoProdutos = await prisma.produtoConsumido.groupBy({
            by: ['produtoId'],
            _sum: { quantidade: true },
        });

        const produtosRank = consumoProdutos.map(p => {
            const info = produtosInfo.find(i => i.id === p.produtoId);
            return {
                nome: info?.nome || 'Desconhecido',
                quantidade: p._sum.quantidade || 0,
                valor: (p._sum.quantidade || 0) * (info?.preco || 0)
            };
        }).sort((a, b) => b.quantidade - a.quantidade);

        const servicosInfo = await prisma.servico.findMany();
        const consumoServicos = await prisma.servicoConsumido.groupBy({
            by: ['servicoId'],
            _count: { _all: true },
        });

        const servicosRank = consumoServicos.map(s => {
            const info = servicosInfo.find(i => i.id === s.servicoId);
            return {
                nome: info?.nome || 'Desconhecido',
                quantidade: s._count._all,
                valor: s._count._all * (info?.preco || 0)
            };
        }).sort((a, b) => b.quantidade - a.quantidade);

        res.json({ produtos: produtosRank, servicos: servicosRank });
    } catch (error) {
        console.error("Erro no relatório Mais Consumidos:", error);
        res.status(500).json({ error: 'Falha ao gerar relatório.' });
    }
});


// Rota: Consumo por tipo e raça de Pet (Com quebra de Produtos/Serviços)
app.get('/api/relatorios/consumo-por-tipo-raca', async (req, res) => {
    try {
        const pets = await prisma.pet.findMany({
            include: {
                produtosConsumidos: { include: { produto: true } },
                servicosConsumidos: { include: { servico: true } },
            },
        });

        // Objeto para agregar os dados de forma mais detalhada
        const agregado: { 
            [tipo: string]: { 
                [raca: string]: {
                    valorProdutos: number;
                    quantidadeProdutos: number;
                    valorServicos: number;
                    quantidadeServicos: number;
                }
            } 
        } = {};

        for (const pet of pets) {
            const { tipo, raca } = pet;

            // Inicializa a estrutura se ainda não existir
            if (!agregado[tipo]) agregado[tipo] = {};
            if (!agregado[tipo][raca]) {
                agregado[tipo][raca] = { valorProdutos: 0, quantidadeProdutos: 0, valorServicos: 0, quantidadeServicos: 0 };
            }

            // Agrega os produtos consumidos pelo pet
            pet.produtosConsumidos.forEach(p => {
                const precoProduto = p.produto?.preco || 0;
                agregado[tipo][raca].valorProdutos += precoProduto * p.quantidade;
                agregado[tipo][raca].quantidadeProdutos += p.quantidade;
            });

            // Agrega os serviços consumidos pelo pet
            pet.servicosConsumidos.forEach(s => {
                const precoServico = s.servico?.preco || 0;
                agregado[tipo][raca].valorServicos += precoServico;
                agregado[tipo][raca].quantidadeServicos += 1;
            });
        }

        // Formata o objeto agregado para o formato que o front-end espera
        const resultadoFinal = Object.keys(agregado).map(tipo => {
            let totalValorProdutosTipo = 0, totalQtdProdutosTipo = 0;
            let totalValorServicosTipo = 0, totalQtdServicosTipo = 0;

            const racas = Object.keys(agregado[tipo]).map(raca => {
                const dadosRaca = agregado[tipo][raca];
                totalValorProdutosTipo += dadosRaca.valorProdutos;
                totalQtdProdutosTipo += dadosRaca.quantidadeProdutos;
                totalValorServicosTipo += dadosRaca.valorServicos;
                totalQtdServicosTipo += dadosRaca.quantidadeServicos;
                return { raca, ...dadosRaca };
            }).sort((a, b) => (b.valorProdutos + b.valorServicos) - (a.valorProdutos + a.valorServicos));

            return { 
                tipo, 
                valorProdutos: totalValorProdutosTipo,
                quantidadeProdutos: totalQtdProdutosTipo,
                valorServicos: totalValorServicosTipo,
                quantidadeServicos: totalQtdServicosTipo,
                racas 
            };
        }).sort((a, b) => (b.valorProdutos + b.valorServicos) - (a.valorProdutos + a.valorServicos));

        res.json(resultadoFinal);
    } catch (error) {
        console.error("Erro no relatório por Tipo/Raça:", error);
        res.status(500).json({ error: 'Falha ao gerar relatório.' });
    }
});


// ------------------- INICIALIZAÇÃO DO SERVIDOR -------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});