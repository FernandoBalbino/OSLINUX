# Créditos e licenças

## Ubuntu, Yaru e GNOME

A tela de entrada segue a estrutura do GDM/Yaru, consultada no upstream `_login-lock.scss` e na documentação oficial Ubuntu/ADSys. O avatar simbólico é Yaru original. A marca Ubuntu 2022 para fundo escuro é um asset original Canonical disponibilizado pelo Wikimedia Commons; o manifesto registra o URL e hash. A adaptação sem senha e com botão Entrar foi solicitada para o simulador educativo.

Os ícones e cursores Yaru são de seus respectivos autores, derivados de Suru/Unity8 e outros projetos documentados pelo upstream. São distribuídos sob CC BY-SA 4.0, preservada em `public/assets/licenses/Yaru.txt`. Fonte: https://github.com/ubuntu/yaru, commit `7f18973e05607c609c4b972f0dd9bff36fa2a13e`. O manifesto `asset-sources.json` registra os arquivos individuais e seus hashes.

Os três cursores PNG de 32×32 são as versões Yaru usadas pelo simulador de referência, obtidas do recurso público observado em https://meulinux.com/sim-assets/ubuntu/cursors/. São mantidos localmente com os hotspots originais (seta: 5,5; mão: 10,6; texto: 14,15). O código JavaScript/CSS do meuLinux não foi incorporado.

O papel de parede Resolute Raccoon é artwork do pacote Ubuntu Wallpapers 26.04.2, de Canonical e colaboradores. As versões WebP presentes no meuLinux foram utilizadas para coincidir com as capturas. O arquivo upstream e a licença estão documentados em `asset-sources.json` e `public/assets/licenses/wallpapers-copyright.txt`. Upstream: https://launchpad.net/ubuntu/+source/ubuntu-wallpapers/26.04.2.

## Fontes

A apresentação usa Inter e Barlow Condensed, obtidas do repositório oficial Google Fonts, sob SIL Open Font License 1.1. Fontes e avisos são locais; hashes e URLs estão no manifesto.

Ubuntu Sans e Ubuntu Sans Mono: Canonical e autores relacionados, Ubuntu Font Licence 1.0. Fontes: https://github.com/canonical/Ubuntu-Sans-fonts e https://github.com/canonical/Ubuntu-Sans-Mono-fonts. Licenças originais em `public/assets/licenses/UbuntuSans.txt` e `UbuntuSansMono.txt`.

## Marcas de aplicativos

O ícone original Google Chrome (2022) foi obtido do Wikimedia Commons. Google Chrome é marca de Google; o arquivo e os metadados são preservados localmente. A instalação .deb desta aula é fictícia. Tempo usa o ícone original Yaru de GNOME Weather.

Firefox e Thunderbird são marcas de Mozilla e seus respectivos responsáveis. Os arquivos originais foram obtidos do Wikimedia Commons e do site oficial Thunderbird, com seus URLs registrados no manifesto. A utilização identifica os aplicativos simulados e não implica endosso.

O logotipo Google foi obtido de https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png. A página de pesquisa é uma simulação local e não se conecta ao Google. Google, LibreOffice, GNOME, Ubuntu e demais nomes e marcas pertencem a seus respectivos titulares.

## Trilha de aprendizagem

Os três estados do robô (neutro, ajuda e comemoração) são ilustrações originais do projeto OSLab, de Fernando Balbino, reutilizadas no OSLINUX para manter o mesmo padrão pedagógico solicitado. Fonte local: projeto OSLab, `assets/learning/mascot`. O ícone de confirmação pertence ao conjunto Fluent UI System Icons, Microsoft, MIT; a licença está em `public/assets/learning/Fluent-LICENSE.txt`.

O ícone exclusivo `public/assets/learning/linux-basics-icon.png` foi criado para o OSLINUX com a ferramenta integrada Image Generation. Prompt: “One desktop app icon for a beginner Linux learning trail, readable at 48 px beside Ubuntu Yaru icons. Compact softly shaded orange rounded-square clipboard, aubergine dotted path ending at a friendly cream robot face. Clean Yaru visual language, subtle edge depth, bold silhouette, centered composition and transparent background. No text, letters, numbers, logos, watermark, extra objects or UI screenshot.”

## Bibliotecas

React, React DOM e Vite são distribuídos sob MIT, com os avisos de suas distribuições. O template de desenvolvimento Product Design mantém seu runtime e testes originais.

## Desktop comparison screenshots

Windows 11 simulator screenshots are reused from FernandoBalbino/OSLab (qa/implementation-desktop-initial.png and qa/implementation-start-menu.png). See https://github.com/FernandoBalbino/OSLab and its THIRD_PARTY_NOTICES.md for the underlying Windows visual assets. Ubuntu screenshots are from this repository.

## Trilhas de adaptação e instalação

Os ícones windows-ubuntu-icon.png e install-programs-icon.png foram gerados com Image Generation para este projeto, usando o ícone original da primeira trilha como referência de acabamento, com fundo transparente. Os conceitos são duas telas ligadas por uma seta e uma caixa de instalação com três documentos.

As capturas lesson2-*.jpg foram obtidas do OSLINUX local, durante as atividades das novas trilhas. Os ícones windows-word.svg, windows-excel.svg e windows-slides.svg foram reutilizados do OSLab de Fernando Balbino (assets/programs); preservam a identificação visual dos aplicativos Windows simulados. As interfaces educativas do Writer, Calc e Impress usam os ícones Yaru locais e a documentação visual de https://www.libreoffice.org/ como referência. LibreOffice é marca de The Document Foundation; Microsoft Office, Word, Excel e PowerPoint pertencem aos respectivos titulares. Não há distribuição dos aplicativos originais.

## Guia do touchpad e fundos opcionais

A ilustração chromebook-two-finger-tap.png foi gerada com Image Generation para mostrar um toque simultâneo com indicador e dedo médio no centro de um touchpad. O gesto foi conferido na ajuda oficial do Chromebook: https://support.google.com/chromebook/answer/1047367?hl=pt-BR. A explicação é texto acessível do simulador.

Os fundos opcionais blue-lock.jpeg e berserk.jpg são as imagens originais fornecidas pelo usuário em 27/10/2026 (1319752.jpeg e 1377511.jpg). As obras, personagens e marcas pertencem aos respectivos titulares; seu fornecimento não transfere direitos autorais nem implica endosso.

## Avatares e fundos adicionais de perfil

Os cinco avatares em public/assets/profiles/avatar-{fox,cat,owl,panda,raccoon}.png foram criados com a ferramenta integrada OpenAI Image Generation: retratos quadrados originais de raposa, gato com fones, coruja com óculos, panda e guaxinim, em ilustração 3D suave sobre fundos pastel, sem texto ou marcas. Cada imagem foi gerada separadamente. Os prompts completos estão em public/assets/profiles/prompts.json.

Os cinco fundos adicionais (futebol.jpeg, pop-claro.jpg, musica-assinaturas.jpg, arco-iris-rosa.jpg e mascara-tatica.jpg) são cópias dos anexos fornecidos pelo usuário em 27/10/2026. Obras, marcas e direitos de imagem pertencem aos respectivos titulares. Os nomes e hashes originais estão em asset-sources.json.
