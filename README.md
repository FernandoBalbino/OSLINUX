# OSLINUX

[Abrir simulador](https://fernandobalbino.github.io/OSLINUX/) · [Aula de introdução ao Linux](https://fernandobalbino.github.io/OSLINUX/slide/)

Simulador educativo de Ubuntu 26.04, em português do Brasil, para PC e Chromebook. Todo o funcionamento acontece no navegador; comandos não são executados no computador real.

A entrada usa uma tela no padrão GDM/Ubuntu, com o perfil Aluno e botão Entrar, sem senha. O clique solicita tela cheia ao navegador. Se o navegador bloquear a solicitação, há uma opção de tentar novamente no desktop. Os slides são acessíveis diretamente e o link final passa por essa entrada antes de abrir a trilha.

## Desenvolvimento

Requer Node.js 22 ou superior e npm/pnpm. Execute `npm install`, depois `npm run dev`. Para verificar a versão final: `npm run build` e `node scripts/serve.mjs`; o endereço padrão é `http://127.0.0.1:4391/`. A saída estática fica em `dist/client`.

## Aplicativos

- Arquivos: pastas, documentos, cópia, recorte, movimentação, pesquisa, Lixeira e restauração. Botão direito abre o menu do sistema.
- Terminal: `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `echo` com `>`/`>>`, `cp`, `mv`, `rm`, `clear`, `help`, `whoami`, histórico e conclusão por Tab.
- Editor: documentos compartilhados com Arquivos e Terminal, salvamento e confirmação de alterações pendentes.
- Firefox: abas, histórico e páginas educativas locais. O Google e suas pesquisas são simulados; sites externos e login não são carregados.
- Calculadora e Configurações: operações básicas, aparência, rede, som, brilho, energia e redefinição.

Os demais ícones da grade abrem um aviso de indisponibilidade. A interface possui duas áreas de trabalho, calendário, atalhos de teclado, menus de contexto e animações com respeito a movimento reduzido.

## Primeiros passos no Linux

O ícone exclusivo no desktop, dock e grade abre uma trilha de 15 missões: abrir Arquivos, encontrar Documentos, criar e renomear uma pasta, criar um documento, escrever e salvar, copiar, excluir e restaurar, mudar o wallpaper, pesquisar ajuda, conectar ao Wi-Fi, reduzir o brilho, somar na Calculadora, instalar Tempo na Central e baixar/instalar o Chrome por pacote .deb. A Central e os downloads são educativos; nenhum programa é instalado no computador real.

## Novas trilhas

Do Windows ao Ubuntu tem 11 missões sobre grade, favoritos, Atividades, caminhos, maiúsculas, arquivos ocultos e instalação. Instalação de Programas tem 12 missões com pesquisa, instalação, Writer, Calc, Impress e reinstalação preservando os trabalhos. São 43 missões nas três trilhas, com acesso livre e progresso independente. Os links `?trilha=1`, `?trilha=2` e `?trilha=3` passam pelo perfil Aluno antes de abrir a atividade.

Writer oferece texto formatado, alinhamento, listas, desfazer/refazer e salvamento. Calc oferece células A1:Z100, fórmulas aritméticas, referências, SOMA e MÉDIA. Impress oferece vários slides, temas e apresentação. Documentos são estruturas educativas locais com nomes .odt/.ods/.odp; não são arquivos binários Office para importação/exportação. Desinstalar a suíte preserva os trabalhos.

A rota `/slide2/` contém 19 slides com capturas locais, comparações com o Windows, setas e links para as duas novas trilhas. A rota `/slide/` original foi preservada.

## Aula antes da prática

A rota `/slide/` contém 13 slides sobre sistema operacional, Linux, Ubuntu, usos, comparação com Windows, desktop, arquivos, aplicativos e ajustes básicos. O modelo visual é a apresentação [Aula TCP × UDP](https://github.com/FernandoBalbino/Aula-TCP-UDP). Há navegação por setas, Home/End, indicadores, tela cheia e fontes oficiais. O último slide destaca o mesmo ícone da trilha e abre `?trilha=1` no desktop.

O robô original do OSLab apresenta uma explicação curta, uma demonstração textual e passos para praticar no próprio sistema. O progresso depende dos eventos e do estado reais do simulador. Cada prática termina com uma pergunta de três opções e feedback explicado. É possível pausar, continuar e refazer sem apagar os arquivos anteriores. O progresso é salvo em `oslinux.learning.v1`; ao recarregar, a missão fica pausada.

## Dados e offline

Arquivos, preferências e histórico são salvos somente neste navegador em `oslinux.state.v1`. Após recarregar, o desktop começa sem janelas abertas. O build final prepara um cache offline completo após o primeiro carregamento. O servidor de desenvolvimento não registra service worker.

## Verificação

`npm test` executa os testes de domínio e do runtime. As cenas `?qa=desktop`, `?qa=apps` e `?qa=browser-quick-settings` fixam o relógio em 16:37, desativam animações para captura e usam estado isolado, sem alterar os dados pessoais. `?qa=extended` prepara as primeiras dez atividades em dados isolados para testar as missões 11–15; não lê nem grava progresso do aluno. `/slide/?qa=1` desativa somente a animação dos slides para capturas.

As referências recortadas ficam em `qa/references`. As originais são preservadas localmente e excluídas do Git por conterem a interface pessoal do navegador. Capturas e comparações ficam em `qa/evidence`; o resultado da revisão visual está em `design-qa.md`.

## Organização

`src/core` contém estado, eventos, arquivos, comandos e catálogo; `src/apps`, os seis aplicativos; `src/ui`, componentes de interface; `src/learning`, catálogo, motor e interface da trilha. Os aplicativos operam sobre o mesmo estado e publicam eventos observáveis. O projeto OSLab original permanece independente.

## Publicação

O workflow `.github/workflows/pages.yml` compila, executa os testes e publica `dist/client` no GitHub Pages. Todos os caminhos de runtime são relativos e os assets são locais.

Consulte `THIRD_PARTY_NOTICES.md` e `asset-sources.json` para origem, versões e licenças dos assets.

A trilha de instalação inclui exemplos visuais no robô para Writer, Calc e Impress. Sua missão 8 ensina a corrigir B2 de 10 para 15 e salvar/reabrir a planilha, sem exigir fórmulas. Nomes nas atividades aceitam diferenças de maiúsculas fora da lição de capitalização, e a pesquisa aceita selecionar o aplicativo antes de digitar o nome completo. O guia de botão direito inclui o toque com dois dedos no Chromebook. Aparência oferece os fundos Ubuntu, Blue Lock e Berserk, com escolha persistida e imagens locais.
