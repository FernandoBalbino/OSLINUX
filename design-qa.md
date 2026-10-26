# OSLINUX — revisão de interface e aprendizagem

Data: 26/10/2026. Fonte visual: três capturas do usuário, normalizadas em `qa/references/scene-*.png`. A interface do Chrome e a barra do Windows foram excluídas. Originais ficam preservados localmente, fora do Git.

## Resultado local

Revisão visual e funcional concluída para o escopo implementado, sem bloqueadores encontrados. Não é uma alegação de igualdade de todos os pixels: tradução, renderização de fontes, conteúdo educativo local e adições solicitadas produzem diferenças. Os aplicativos ainda não implementados mostram o aviso previsto.

| Elemento | Resultado medido |
| --- | --- |
| Cena principal | 1919 × 911, densidade 1 |
| Barra superior | 32 px; RGB 19,19,19 (`#131313`) |
| Dock | 66 px; ícones em caixas de 48 px |
| Firefox | x=464, y=112; 940 × 640 px |
| Painel rápido | x=1568, y=38; 344 × 350 px |
| Cursor | Yaru original, 32 × 32; hotspots 5,5 / 10,6 / 14,15 |
| Fontes e imagens | Fontes carregadas; nenhuma imagem ausente nas cenas |
| Overflow horizontal | Ausente nas resoluções verificadas |

O limite de 2 px foi conferido nos alinhamentos e dimensões principais da janela e do painel. O dock usa a aproximação aprovada de 66/67 px. A barra e o dock mais escuros seguem a correção posterior do usuário. O oitavo favorito e o atalho adicional são o ícone exclusivo da trilha, também solicitado posteriormente.

Comparações lado a lado, sobreposições e recortes estão em `qa/evidence/*-comparison.png`, `*-overlay.png` e `crop-*.png`. `reference-metrics.json` registra as medidas. A diferença média de RGB é apenas um diagnóstico, não um percentual de fidelidade.

## Arquivos, janelas e entrada

- Fluxo Terminal → Arquivos → Editor → Terminal verificado com o mesmo documento e conteúdo salvo.
- Criar, renomear, copiar, mover para a Lixeira e restaurar verificados na interface.
- Documento não salvo: cancelamento e descarte conferidos.
- Menus do desktop, de arquivo e de área vazia substituem o menu do navegador; Escape e clique fora fecham.
- Nome longo em janela de Arquivos de 524 px conferido: quebra completa, sem corte da segunda linha. Evidências em `files-1366.png` e `responsive-metrics.json`.
- Animações de janela, minimizar, menus e grade implementadas; cenas determinísticas desativam movimento. A preferência `prefers-reduced-motion` é respeitada.
- Persistência do sistema de arquivos, preferências, histórico, pacotes e progresso coberta por testes de domínio.

## Trilha no padrão OSLab

O código e os assets originais do OSLab foram inspecionados. O padrão reutilizado é: explicação breve → demonstração textual → ações no próprio desktop → pergunta de três opções → feedback explicado vermelho/verde → próxima/refazer/pausar. O robô possui estados neutro, ajuda e comemoração.

As dez missões iniciais foram realizadas pela interface, da abertura de Arquivos até a pesquisa de ajuda. A resposta errada e a nova tentativa foram verificadas. As cinco adicionais também foram realizadas pela interface: Wi-Fi Laboratório, brilho, 7+5=12, instalação/abertura de Tempo e download .deb/instalação/abertura do Chrome.

Para verificar as missões 11–15 sem repetir os dez primeiros exercícios, a cena `?qa=extended` prepara dados isolados pelas mesmas operações do modelo. Ela nunca grava ou lê o progresso do aluno. `learning-15-complete.png` registra 15/15 nessa cena. `learning-complete.png` registra o percurso inicial anterior à ampliação. `mission-wrong-feedback.png`, `mission-correct-feedback.png` e `app-center-mission.png` registram os estados intermediários.

Uma sessão normal completou a primeira missão, iniciou a segunda, pausou e recarregou. O progresso reapareceu com opção Continuar missão, conforme `learning-resume.png`.

## Apresentação `/slide/`

11 slides, inspirados na estrutura e nos estilos reais de `FernandoBalbino/Aula-TCP-UDP`: Inter/Barlow Condensed locais, roxo `#3012b5`, laranja `#ff603d`, navegação por indicadores e setas. Capa, tabela e encerramento foram comparados visualmente ao exemplo.

Todos os slides foram capturados e inspecionados em 1366×768. Nenhuma imagem ausente, rolagem horizontal ou conteúdo vertical excedente nessa resolução (`slides-metrics.json`). Há também revisão em 1280×720. Contatos completos: `slides-contact-1.png` e `slides-contact-2.png`.

O último slide destaca o mesmo arquivo do ícone da trilha e seu nome exato. O link final foi acionado e abriu o desktop com a janela da trilha em `?trilha=1`. Setas, Home/End, tela cheia e fontes estão disponíveis. Os fatos introdutórios usam Kernel.org, documentação oficial do Ubuntu e ajuda oficial do Chrome, vinculados em Fontes e aula.

## Testes e limites

45 testes aprovados: arquivos, Terminal, calculadora, transações, persistência, colisões, rede, 15 missões, sequência, pausa/retomada, repetição segura, instalação, downloads e runtime Sites. Build de produção gera `dist/client/index.html`, `dist/client/slide/index.html`, service worker, `dist/server/index.js` e `dist/.openai/hosting.json`.

Firefox e Chrome navegam somente por páginas locais simuladas. Tempo mostra valores fictícios. O pacote .deb não contém executável. O catálogo da Central é intencionalmente pequeno. A verificação de publicação e cache offline é registrada em `qa/evidence/release.json` após o deploy.
