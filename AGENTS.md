# Prototype Instructions

## OSLINUX visual contract

- The user's Ubuntu screenshots are the visual source of truth. Keep Portuguese labels and the original Yaru icons, Ubuntu fonts, wallpaper and cursor assets.
- Use the original Yaru cursors at 32 px: left_ptr hotspot 5 5, hand2 hotspot 10 6, xterm hotspot 14 15.
- The top panel and dock use #131313, as verified against meuLinux on 2026-10-26.
- Folder labels must wrap fully and remain readable when windows shrink; never crop the second line.
- Target PC and Chromebook at 1366x768, plus the supplied reference resolutions. Keep app state shared and all runtime assets local.
- The beginner trail has exactly 20 sequential missions, the original OSLab robot, event/state validation, and a three-option review with explained red/green feedback. Do not replace practice with direct completion buttons.
- The /slide presentation follows Aula-TCP-UDP, introduces Linux and Ubuntu with Windows comparisons, and ends by highlighting the exact trail icon. The five added missions cover Wi-Fi, brightness, a sum, App Center and a simulated Chrome .deb download.
- System context menus must replace the browser menu inside the desktop. Preserve smooth transitions and reduced-motion support.
- Before every normal simulator session, show an Ubuntu GDM-style greeter with the single local profile (Aluno by default, then the saved display name and avatar), no password field, and only an Entrar action. Request browser fullscreen directly in that click. Keep /slide independent; its final link goes through login before opening the trail. Deterministic desktop QA scenes may bypass login; ?qa=login captures it.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

- Missions 16–20 use Calendar, Clocks, Characters, Images and Help from the existing app grid, with real interactive tasks and sequential event validation. Preserve all first 15 missions and saved learner progress.
- Add image-led Windows 11/Ubuntu desktop comparisons to /slide, preserving the original slides and using clear arrows that point to the Ubuntu app dock and app-grid button.

## Trilhas e LibreOffice

- Preserve the three independently accessible trails: 20 beginner missions, 13 Windows-to-Ubuntu missions, and 12 installation/LibreOffice missions. Keep sequential unlocking inside each trail, independent saved progress, and only one active guide robot.
- The migration and installation trails use their own generated icons, matching the existing rounded 3D visual language. Reuse each exact icon across desktop, grid, windows and slides.
- Writer, Calc and Impress have distinct Portuguese interfaces and functional basic editing. Store documents in the shared virtual filesystem, preserve formatting/formulas/slides when copied or renamed, and never remove documents when uninstalling software.
- /slide2 is a separate 19-slide image-led lesson covering both new trails. Preserve /slide, local screenshots, clear arrows, offline entry and links through the Aluno greeter to the correct trail.
- Office files in this simulator are educational structured documents using .odt/.ods/.odp names; do not claim import or export of real Office binaries.

## Facilidade de uso no Chromebook

- A recuperação de uma janela minimizada na trilha de adaptação aceita o dock e Atividades, exigindo a mesma janela e a minimização anterior.
- O menu de contexto da grade de aplicativos preserva a grade e a pesquisa. Adicionar ou remover favoritos não deve voltar ao desktop. Abrir uma janela pelo dock fecha a grade e mostra o aplicativo.
- Nas missões com botão direito, o robô mostra a ilustração local de um toque simultâneo com dois dedos no centro do touchpad do Chromebook e explica a equivalência com o mouse.
- Objetivos de nomes aceitam diferenças entre maiúsculas e minúsculas, mantendo o caminho real usado pelo aluno. O sistema de arquivos continua sensível à capitalização e a missão Aula.txt/aula.txt exige distinguir os dois nomes.
- Pesquisar parte do nome e selecionar o resultado correto deve valer como pesquisa; não exigir a digitação integral quando a sugestão já aparece.
- Todos os nomes da grade devem quebrar linhas por inteiro e continuar legíveis com o robô aberto em 1366×768; a grade pode rolar verticalmente.
- Writer, Calc e Impress apresentam exemplos concretos no robô durante criação e salvamento: texto formatado, tabela com endereços e destaque na célula a alterar, e dois slides. O aluno realiza as ações no aplicativo.
- Blue Lock e Berserk, fornecidos pelo usuário, são opções locais de papel de parede em Aparência. Preservar os padrões Ubuntu e a escolha persistida, também offline.

- A missão 8 de Instalação de Programas é “Atualize e salve sua planilha”: alterar B2 de 10 para 15, salvar, fechar e reabrir. Não exigir fórmulas nesta trilha básica; manter 12 missões e os progressos existentes. A aula /slide2 acompanha essa simplificação.

## Perfil e novas atividades de personalização

- Do Windows ao Ubuntu tem 13 missões: preservar as 11 anteriores e acrescentar trocar o papel de parede e personalizar nome/avatar nas posições 12 e 13. São 45 missões ao todo. Manter as mesmas chaves de progresso.
- Configurações → Perfil permite salvar nome ou apelido (até 40 caracteres) e escolher entre cinco avatares originais gerados com imagegen, além do padrão Ubuntu. O perfil é único, sem senha, persistido no navegador e compartilhado com a entrada, a tela bloqueada e Sistema. O nome de exibição não renomeia a pasta /home/aluno.
- Preservar os quatro fundos existentes e adicionar os cinco anexos de 27/10/2026 como opções locais. A galeria de nove fundos quebra em colunas e rola verticalmente. Não trocar o fundo automaticamente para preparar a missão.
