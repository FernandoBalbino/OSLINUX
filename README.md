# OSLINUX

Simulador educativo de Ubuntu 26.04, em português do Brasil, para PC e Chromebook. Todo o funcionamento acontece no navegador; comandos não são executados no computador real.

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

## Aula antes da prática

A rota `/slide/` contém 11 slides sobre sistema operacional, Linux, Ubuntu, usos, comparação com Windows, desktop, arquivos, aplicativos e ajustes básicos. O modelo visual é a apresentação [Aula TCP × UDP](https://github.com/FernandoBalbino/Aula-TCP-UDP). Há navegação por setas, Home/End, indicadores, tela cheia e fontes oficiais. O último slide destaca o mesmo ícone da trilha e abre `?trilha=1` no desktop.

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
