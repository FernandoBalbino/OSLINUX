# Vídeo: O Terminal, o chat com o computador

Vídeo para a TV da sala (1920×1080, 30 fps), ligado à trilha **Primeiros passos no Terminal** do OSLINUX.

**Narrador:** o robô do OSLab.

**Ideia central:** o Terminal é um chat com o computador. Você escreve uma ordem, aperta Enter e ele responde.

Para cada comando, o vídeo mostra:

1. o Terminal girando em 3D e o zoom chegando perto;
2. a digitação com som de tecla;
3. a resposta do computador;
4. a comparação **Sem o Terminal × Com o Terminal**.

## Voz no ElevenLabs

- **Voz:** Amanndev (ID `VnO7flSpwktZAgGGSQ2V`). É masculina, jovem, em português do Brasil e própria para tutoriais de tecnologia.
- **Modelo:** Eleven v4 (`eleven_v4`). Ele aceita a marcação `[animado]`. Se gerar manualmente com o Eleven Multilingual v2, apague a marcação.
- **Ajustes sugeridos:** Stability 45–50 %, Similarity 75 % e Style 20 %.
- **Pronúncia:** as siglas estão escritas como se falam (pê-dáblio-dê, éle-ésse, cê-dê…). Assim a voz não soletra errado. Na tela aparecem os comandos de verdade.

## Onde salvar cada áudio

Salve em **`video/narracao/`**, com exatamente o nome da tabela, em `.mp3`.

O `build.mjs` mede a duração de cada arquivo e ajusta o tempo das cenas sozinho. Para trocar uma narração, basta substituir o arquivo e rodar `npm run render` dentro de `video/`.

| Arquivo | Cena | Texto da narração |
|---|---|---|
| 01-abertura.mp3 | Abertura | [animado] Oi, turma! Eu sou o robô do OSLab. Sabe aquela tela preta cheia de letrinhas, que aparece em filme de hacker? Ela se chama Terminal. E hoje você vai descobrir que ela é bem mais simples do que parece! |
| 02-o-que-e.mp3 | O que é | O Terminal é como um chat com o computador. Você escreve uma ordem, aperta Enter, e o computador responde logo embaixo. Nada de botões ou ícones: é só texto. Essas ordens se chamam comandos. |
| 03-anatomia.mp3 | O começo da linha | Antes de digitar, olhe o começo da linha. Aluno é o seu usuário. Ubuntu é o nome do computador. O sinal de til quer dizer: você está na sua pasta pessoal. E o cifrão avisa: pode digitar! |
| 04-para-que-serve.mp3 | Para que serve | E para que serve o Terminal? Técnicos de informática usam ele para consertar problemas, instalar programas e configurar servidores. Muitos servidores da internet nem têm tela: é tudo pelo Terminal. Por isso, aprender isso é coisa de profissional! |
| 05-abrir.mp3 | Como abrir | Para abrir o Terminal, clique em Mostrar aplicativos, no fim do dock. Digite Terminal na pesquisa e clique no ícone. Pronto, a janela abriu! |
| 06-help.mp3 | help | Primeiro comando: help, que quer dizer ajuda. Ele mostra a lista de comandos que você pode usar. É o manual de bolso do Terminal. |
| 07-whoami-pwd.mp3 | whoami e pwd | Agora, who am I: quem sou eu? O computador responde: aluno. E o pê-dáblio-dê mostra em que pasta você está. Sem o Terminal, você teria que procurar essas informações pela tela. |
| 08-ls.mp3 | ls | O éle-ésse lista tudo o que tem na pasta. Os nomes com uma barra no final são pastas. É a mesma coisa que abrir o app Arquivos e olhar. |
| 09-cd.mp3 | cd | Com o cê-dê, você entra em uma pasta. Cê-dê Documentos é igual a dar dois cliques na pasta Documentos. Repare: o começo da linha agora mostra Documentos. |
| 10-cd-voltar.mp3 | cd .. | E para voltar? Cê-dê, espaço, ponto ponto. Os dois pontos querem dizer: a pasta de cima. É o botão Voltar do Terminal. |
| 11-mkdir.mp3 | mkdir | Hora de criar! O mêique-dir cria uma pasta nova. Sem o Terminal, são quatro passos: botão direito, Nova pasta, digitar o nome e clicar em Criar. Com o Terminal, é uma linha só! |
| 12-touch.mp3 | touch | O touch cria um arquivo vazio. Touch notas ponto tê-xis-tê, e o arquivo aparece na hora, prontinho para usar. |
| 13-echo-cat.mp3 | echo e cat | O echo repete um texto. Com o sinal de maior, esse texto vai para dentro do arquivo. Depois, o cat lê o arquivo para você. Sem o Terminal, você abriria o Editor de Texto, escreveria e salvaria. |
| 14-cp.mp3 | cp | O cê-pê faz uma cópia. Primeiro vem o nome do original, depois o nome da cópia. Sem o Terminal, seria copiar, colar e renomear. |
| 15-mv.mp3 | mv | O ême-vê troca o nome de um arquivo. Primeiro o nome atual, depois o nome novo. É o mesmo que clicar com o botão direito e escolher Renomear. |
| 16-rm.mp3 | rm | E o érre-ême apaga. Atenção! No Ubuntu de verdade, o érre-ême não manda para a Lixeira: o arquivo some na hora. Então, confira o nome antes de apertar Enter. |
| 17-atalhos.mp3 | Tab, seta e clear | Agora, três truques de mestre. A tecla Tab completa os nomes para você. A seta para cima traz de volta o último comando. E o clear limpa a tela. |
| 18-resumo.mp3 | Resumo | Vamos revisar? Help: ajuda. Who am I e pê-dáblio-dê: quem sou e onde estou. Éle-ésse: listar. Cê-dê: entrar e voltar. Mêique-dir: criar pasta. Touch: criar arquivo. Echo e cat: escrever e ler. Cê-pê: copiar. Ême-vê: renomear. E érre-ême: apagar. |
| 19-final.mp3 | Encerramento | [animado] Agora é a sua vez! No OSLINUX, abra a trilha Primeiros passos no Terminal e complete as doze missões. E lembre: errar faz parte, nada quebra. Bora digitar! |

## Como gerar o vídeo

Dentro da pasta `video/`:

```bash
npm install
```

```bash
npm run render
```

O vídeo sai em `video/renders/terminal-oslinux.mp4`.

- **Feito com:** HyperFrames (HTML + GSAP), com o FFmpeg e o FFprobe que vêm nos pacotes `ffmpeg-static` e `ffprobe-static`.
- **Rascunho rápido:** `node build.mjs && node render.mjs draft`.

## Sons

Os sons de clique do mouse e de tecla são sintetizados pelo `build.mjs`, sem arquivos de terceiros. Eles ficam em `video/assets/sfx.wav`, alinhados com cada clique e com cada letra digitada.
