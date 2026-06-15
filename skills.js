// ══════════════════════════════════════════════
// DATA — Skills, Exercises & Week Schedule
// ══════════════════════════════════════════════

export const SKILLS_PROGRESSION = {
  hs: {
    name: 'Handstand / HSPU',
    nameEn: 'Handstand & Push-up (equilíbrio + flexão de cabeça para baixo)',
    chip: 'chip-hs',
    color: '#c8f54a',
    levels: [
      { name: 'HS — Costas para a parede', nameEn: 'Wall Handstand (costas para a parede)', target: 15, unit: 's' },
      { name: 'HS — Afasta da parede', nameEn: 'Wall Handstand Walk-out (afasta as mãos da parede)', target: 10, unit: 's' },
      { name: 'HS livre — 5 segundos', nameEn: 'Freestanding Handstand 5s (equilíbrio livre)', target: 5, unit: 's' },
      { name: 'HS livre — 15 segundos', nameEn: 'Freestanding Handstand 15s', target: 15, unit: 's' },
      { name: 'HS livre — 30 segundos', nameEn: 'Freestanding Handstand 30s (domínio)', target: 30, unit: 's' },
      { name: 'Posição dos 90° na parede', nameEn: '90° Hold (corpo em L na parede)', target: 15, unit: 's' },
      { name: 'Pike alto nos livros', nameEn: 'Elevated Pike Hold (quadril alto nas paralelas)', target: 10, unit: 's' },
      { name: 'Negativo do HSPU', nameEn: 'HSPU Negative (desce devagar sem subir)', target: 5, unit: 'reps' },
      { name: 'HSPU com apoio (cabeça toca o chão)', nameEn: 'Kipping HSPU (com impulso)', target: 3, unit: 'reps' },
      { name: 'HSPU estrito', nameEn: 'Strict HSPU (sem impulso, força pura)', target: 5, unit: 'reps' },
    ]
  },
  lsit: {
    name: 'L-sit',
    nameEn: 'L-sit (sentar no ar com as pernas paralelas ao chão)',
    chip: 'chip-ls',
    color: '#4af5c8',
    levels: [
      { name: 'L-sit com uma perna', nameEn: 'One Leg L-sit (uma perna levantada)', target: 10, unit: 's' },
      { name: 'L-sit completo', nameEn: 'L-sit (as duas pernas juntas)', target: 10, unit: 's' },
      { name: 'L-sit 20 segundos', nameEn: 'L-sit 20s hold', target: 20, unit: 's' },
      { name: 'Straddle L-sit (pernas abertas)', nameEn: 'Straddle L-sit (pernas abertas)', target: 15, unit: 's' },
      { name: 'L-sit 30 segundos', nameEn: 'L-sit 30s hold (domínio)', target: 30, unit: 's' },
    ]
  },
  fl: {
    name: 'Front Lever',
    nameEn: 'Front Lever (corpo paralelo ao chão, olhando para cima, pendurado)',
    chip: 'chip-fl',
    color: '#f54a7a',
    levels: [
      { name: 'Tuck — joelhos no peito', nameEn: 'Tuck Front Lever (joelhos dobrados)', target: 15, unit: 's' },
      { name: 'Advanced Tuck — joelhos mais afastados', nameEn: 'Advanced Tuck Front Lever (quadril mais baixo)', target: 15, unit: 's' },
      { name: 'One Leg — uma perna estendida', nameEn: 'One Leg Front Lever (uma perna esticada)', target: 10, unit: 's' },
      { name: 'Straddle — pernas abertas', nameEn: 'Straddle Front Lever (pernas abertas)', target: 8, unit: 's' },
      { name: 'Full — pernas juntas e estendidas', nameEn: 'Full Front Lever (posição completa)', target: 8, unit: 's' },
    ]
  },
  bl: {
    name: 'Back Lever',
    nameEn: 'Back Lever (corpo paralelo ao chão, olhando para baixo, pendurado)',
    chip: 'chip-bl',
    color: '#a47af5',
    levels: [
      { name: 'Tuck — joelhos no peito', nameEn: 'Tuck Back Lever (joelhos dobrados)', target: 15, unit: 's' },
      { name: 'Advanced Tuck — joelhos mais afastados', nameEn: 'Advanced Tuck Back Lever', target: 15, unit: 's' },
      { name: 'One Leg — uma perna estendida', nameEn: 'One Leg Back Lever', target: 10, unit: 's' },
      { name: 'Straddle — pernas abertas', nameEn: 'Straddle Back Lever (pernas abertas)', target: 8, unit: 's' },
      { name: 'Full — pernas juntas e estendidas', nameEn: 'Full Back Lever (posição completa)', target: 8, unit: 's' },
    ]
  }
};

export const EXERCISES = [
  // SEGUNDA (day: 0)
  { id: 'wrist-warm', day: 0, name: 'Girar os pulsos', nameEn: 'Wrist Circles (girar os pulsos para aquecer)', sets: '2 × 40s', equip: ['chão'], how: 'Gire os pulsos devagar para os dois lados — como se estivesse desenhando círculos no ar. Faça isso SEMPRE antes de colocar a mão no chão.', tip: 'Nunca pule esse exercício. 80% das lesões de handstand começam aqui.', yt: 'mSZWSQSSEjE', hasRecord: false },
  { id: 'wrist-str', day: 0, name: 'Esticar os pulsos no chão', nameEn: 'Wrist Stretches (alongamento dos pulsos)', sets: '2 × 30s', equip: ['chão'], how: 'Coloca as mãos no chão, dedos para frente, e inclina o corpo para frente. Depois vira os dedos para trás e repete.', tip: 'Sente o estiramento. Não force além do desconforto.', yt: 'mSZWSQSSEjE', hasRecord: false },
  { id: 'scap-pushup', day: 0, name: 'Empurrar e soltar as escápulas', nameEn: 'Scapular Push-up (protrair e retrair as escápulas)', sets: '3 × 10', equip: ['chão'], how: 'Com os braços esticados, empurra o chão para longe (escápulas saem) e depois deixa afundar (escápulas juntam). Os cotovelos não dobram.', tip: 'Esse movimento é a base de todas as skills. Aprenda bem.', yt: 'RUBFCkKKcUY', hasRecord: false },
  { id: 'hs-wall-back', day: 0, name: 'HS — costas para a parede', nameEn: 'Wall Handstand — Back to Wall (costas encostadas na parede)', sets: '5 séries — máx segundos', equip: ['parede', 'chão'], how: 'Coloca as mãos perto da parede e sobe com os pés. Costas encostam (não a barriga). Empurra o chão com força, fecha o bumbum, fica reto como uma régua.', tip: 'Meta: chegar em 25s. Conta os segundos em voz alta.', yt: 'stVj9X6RRFk', hasRecord: true, skillKey: 'hs', levelIdx: 0 },
  { id: 'hs-walkout', day: 0, name: 'HS — afasta as mãos da parede', nameEn: 'Handstand Walk-out (afastar as mãos da parede aos poucos)', sets: '6 tentativas', equip: ['parede', 'chão'], how: 'Sobe com a barriga para a parede, depois caminha as mãos para longe uns 10–15 cm e tenta ficar parado 3–5s sem encostar.', tip: 'A transição mais importante para o handstand livre. Não tenha medo de cair.', yt: 'JyyKGE-Ajs8', hasRecord: true, skillKey: 'hs', levelIdx: 1 },
  { id: 'hs-free', day: 0, name: 'HS livre — tenta parar no equilíbrio', nameEn: 'Freestanding Handstand (handstand sem apoio)', sets: '10 tentativas', equip: ['chão'], how: 'Sobe sem a parede e tenta achar o ponto de equilíbrio. Não precisa ficar muito tempo. O objetivo é sentir onde é o ponto exato.', tip: 'Cai? Levanta e tenta de novo sem pensar demais.', yt: '7wkLRhW7e0A', hasRecord: true, skillKey: 'hs', levelIdx: 2 },
  { id: '90-hold', day: 0, name: 'Posição dos 90° na parede', nameEn: '90° Hold / Pike on Wall (corpo em formato de L na parede)', sets: '5 séries — máx segundos', equip: ['parede', 'chão'], how: 'Mãos no chão perto da parede, sobe com os pés até ficar em L. Quadril fica bem em cima dos ombros. Empurra o chão com tudo.', tip: 'Esse é o exercício mais importante para a flexão no handstand. Quando chegar em 20s, a flexão está próxima.', yt: 'kShJnmKMaVc', hasRecord: true, skillKey: 'hs', levelIdx: 5 },
  { id: 'pike-compression', day: 0, name: 'Comprimir o core no chão', nameEn: 'Pike Compression / L-sit Press (comprimir o core sentado)', sets: '4 × 10s', equip: ['chão'], how: 'Senta com as pernas estendidas, mãos ao lado do quadril. Pressiona o chão tentando levantar o bumbum. Mesmo que não saia, a tensão está treinando.', tip: 'Mantém as pernas esticadas. Quanto mais os tornozelos subirem, melhor.', yt: 'H_iZG5-L_KI', hasRecord: false },
  { id: 'pike-elevated', day: 0, name: 'Pike alto nos livros', nameEn: 'Elevated Pike Hold (quadril alto com mãos elevadas)', sets: '4 × 8s', equip: ['livros', 'chão'], how: 'Duas pilhas de livros, uma para cada mão. Pés no chão em pike (corpo dobrado na cintura). Tenta levantar o quadril o máximo com as pernas estendidas.', tip: 'Quanto mais alto o quadril, mais próximo você está do press handstand.', yt: 'FwwWMkLMOJk', hasRecord: true, skillKey: 'hs', levelIdx: 6 },
  // TERÇA (day: 1)
  { id: 'dead-hang', day: 1, name: 'Pendurar parado na barra', nameEn: 'Dead Hang (pendurado parado)', sets: '3 × 20s', equip: ['barra'], how: 'Fica pendurado quieto na barra por 20s. Deixa o ombro puxar e relaxar. Aquece o ombro para o front lever.', tip: 'Relaxa os ombros no começo. Depois abaixa as escápulas (ombros longe das orelhas).', yt: 'mSZWSQSSEjE', hasRecord: false },
  { id: 'scap-pull', day: 1, name: 'Pendurado — sobe e desce os ombros', nameEn: 'Scapular Pull-up (deprimir e elevar as escápulas pendurado)', sets: '3 × 8', equip: ['barra'], how: 'Pendurado na barra, abaixa os ombros sem dobrar o cotovelo. Sobe e desce devagar.', tip: 'Esse movimento ativa as costas para o front lever.', yt: 'RUBFCkKKcUY', hasRecord: false },
  { id: 'fl-tuck', day: 1, name: 'Front Lever — joelhos no peito', nameEn: 'Tuck Front Lever (corpo paralelo ao chão com joelhos dobrados)', sets: '5 séries — máx segundos', equip: ['barra'], how: 'Pendurado na barra, puxa o corpo para ficar paralelo ao chão com os joelhos dobrados no peito. Ombros empurrados para baixo — longe das orelhas.', tip: 'Ombros para baixo é a chave. Se os ombros subirem, você perdeu a posição.', yt: 'lkGhntOoLNk', hasRecord: true, skillKey: 'fl', levelIdx: 0 },
  { id: 'fl-raise', day: 1, name: 'Subir lento para o Front Lever', nameEn: 'Front Lever Raise (subir e descer controlado)', sets: '4 × 4 reps', equip: ['barra'], how: 'Pendurado, sobe em 3s até a posição de front lever (joelhos no peito), segura 2s, desce em 3s.', tip: 'O movimento de subida é onde você cria força real. Não deixe cair.', yt: 'oNtIlTb1LLE', hasRecord: false },
  { id: 'fl-adv-tuck', day: 1, name: 'Tenta o Advanced Tuck', nameEn: 'Advanced Tuck Front Lever (joelhos mais afastados do peito)', sets: '3 tentativas', equip: ['barra'], how: 'No front lever, tenta abrir um pouco — joelhos ficam mais longe do peito. Se conseguir 3s assim, você está progredindo.', tip: 'Não force. Se os ombros subirem, volta para o tuck normal.', yt: '4DZPaCOfJOI', hasRecord: true, skillKey: 'fl', levelIdx: 1 },
  { id: 'plank-push', day: 1, name: 'Prancha com empurrada de ombros', nameEn: 'Planche Lean / Scapular Push-up (protração em prancha)', sets: '3 × 10', equip: ['chão'], how: 'Em prancha com os braços esticados, empurra o chão para cima sem dobrar o cotovelo. Fortalece os ombros.', tip: 'Mantém o core fechado. Não deixa o quadril cair.', yt: 'RUBFCkKKcUY', hasRecord: false },
  { id: 'flex-pausa', day: 1, name: 'Flexão com pausa no meio', nameEn: 'Pause Push-up (flexão com parada em 90°)', sets: '3 × 6', equip: ['chão'], how: 'Faz a flexão normal, mas para 3s quando os cotovelos estão a 90°. Constrói força que vai ajudar na flexão do handstand.', tip: 'Mais lento = mais força. Não precisa ser rápido.', yt: 'otLf0tw8vYE', hasRecord: false },
  { id: 'hollow', day: 1, name: 'Bananinha no chão', nameEn: 'Hollow Body Hold (posição de banana)', sets: '3 × 30s', equip: ['chão'], how: 'Deita, cola a lombar no chão, braços para cima e pernas a 30° do chão. Segura sem desgrudar a lombar.', tip: 'Se a lombar desgruda, sobe as pernas até conseguir manter.', yt: '2-3wv5kLNnw', hasRecord: false },
  // QUARTA (day: 2)
  { id: 'chest-wall', day: 2, name: 'Abrir o peito na parede', nameEn: 'Wall Chest Stretch (alongamento do peito na parede)', sets: '2 × 30s cada lado', equip: ['parede'], how: 'Coloca o braço na parede e vira o corpo para o outro lado. Sente o peito e o ombro abrindo.', tip: 'Mantém o cotovelo na altura do ombro.', yt: 'kShJnmKMaVc', hasRecord: false },
  { id: 'hs-wall-back2', day: 2, name: 'HS — costas para a parede', nameEn: 'Wall Handstand — Back to Wall (costas encostadas na parede)', sets: '5 séries — máx segundos', equip: ['parede', 'chão'], how: 'Igual à segunda. Hoje tenta bater seu recorde de segundos em pelo menos uma série.', tip: 'Foco total: mãos abertas, empurra, fecha bumbum, fica reto.', yt: 'stVj9X6RRFk', hasRecord: true, skillKey: 'hs', levelIdx: 0 },
  { id: 'hs-free2', day: 2, name: 'HS livre — mais agressivo', nameEn: 'Freestanding Handstand (tentativas livres)', sets: '10 tentativas', equip: ['chão'], how: '10 tentativas. Hoje pode arriscar mais. Tenta segurar mais do que na segunda.', tip: 'Se cair, levanta e tenta de novo sem pensar muito.', yt: '7wkLRhW7e0A', hasRecord: true, skillKey: 'hs', levelIdx: 2 },
  { id: 'lsit-books', day: 2, name: 'L-sit nos livros', nameEn: 'L-sit on Books (sentar no ar com as pernas paralelas)', sets: '6 séries — acumula 60s', equip: ['livros'], how: 'Duas pilhas de livros, uma para cada mão. Empurra para baixo e levanta as pernas paralelas ao chão.', tip: 'Se não sair com as duas pernas, levanta uma de cada vez primeiro.', yt: 'r-LQKNxGJB0', hasRecord: true, skillKey: 'lsit', levelIdx: 1 },
  { id: 'lsit-neg', day: 2, name: 'Baixar as pernas devagar do L-sit', nameEn: 'L-sit Negative / Leg Lower (excêntrico dos flexores do quadril)', sets: '3 × 6 reps', equip: ['livros'], how: 'No L-sit, deixa as pernas descerem em 4–5 segundos bem devagar. Depois sobe rápido.', tip: 'A parte mais fraca de todo mundo é exatamente aqui.', yt: 'r-LQKNxGJB0', hasRecord: false },
  { id: 'lsit-straddle', day: 2, name: 'L-sit com pernas abertas', nameEn: 'Straddle L-sit (pernas abertas para facilitar)', sets: '3 séries — máx segundos', equip: ['livros'], how: 'Mesma coisa mas abre as pernas. É mais fácil e deixa você acumular mais tempo.', tip: 'Progressão natural para o V-sit depois.', yt: 'FwwWMkLMOJk', hasRecord: true, skillKey: 'lsit', levelIdx: 3 },
  { id: 'hollow2', day: 2, name: 'Bananinha no chão', nameEn: 'Hollow Body Hold (posição de banana)', sets: '3 × 30s', equip: ['chão'], how: 'Deita, cola a lombar no chão, braços para cima e pernas a 30° do chão.', tip: 'O core de todas as skills. Aprende a doer menos.', yt: '2-3wv5kLNnw', hasRecord: false },
  // QUINTA (day: 3)
  { id: 'german-hang', day: 3, name: 'Ombro para trás pendurado', nameEn: 'German Hang (ombro em hiperextensão pendurado)', sets: '2 × 20s', equip: ['barra'], how: 'Pendurado na barra, deixa os braços irem para trás devagar até sentir o ombro abrindo. Segura suave.', tip: 'Dor de esticar é normal. Dor aguda ou de beliscão — para imediatamente.', yt: '2n1FFbZKNIk', hasRecord: false },
  { id: 'skin-cat', day: 3, name: 'Passar as pernas pela barra devagar', nameEn: 'Skin the Cat (passar as pernas pela barra e voltar)', sets: '3 × 2 reps', equip: ['barra'], how: 'Pendurado, levanta as pernas e passa por trás da barra bem devagar. Volta pelo mesmo caminho.', tip: 'O movimento mais importante para preparar o ombro para o back lever.', yt: '2n1FFbZKNIk', hasRecord: false },
  { id: 'bl-tuck', day: 3, name: 'Back Lever — joelhos no peito', nameEn: 'Tuck Back Lever (corpo paralelo ao chão, olhando para baixo)', sets: '5 séries — máx segundos', equip: ['barra'], how: 'Na barra, passa as pernas e fica de barriga para baixo paralelo ao chão com os joelhos dobrados. Palmas das mãos viradas para fora. Ombros não sobem acima do corpo.', tip: 'Ombros no nível do corpo ou abaixo. Se subirem você perdeu a posição.', yt: 'BwhZYpIdhro', hasRecord: true, skillKey: 'bl', levelIdx: 0 },
  { id: 'skin-slow', day: 3, name: 'Passar as pernas em 4 segundos', nameEn: 'Slow Skin the Cat (descida em 4s)', sets: '4 × 3 reps', equip: ['barra'], how: 'Passa as pernas pela barra em exatamente 4 segundos. Volta pelo mesmo caminho. Constrói força em toda a amplitude.', tip: 'Quanto mais devagar, mais força você constrói.', yt: '2n1FFbZKNIk', hasRecord: false },
  { id: 'bl-extend', day: 3, name: 'Tenta soltar as pernas mais', nameEn: 'Advanced Tuck Back Lever (joelhos mais afastados)', sets: '3 × 2s', equip: ['barra'], how: 'No back lever com joelhos dobrados, tenta estender as pernas um pouco por 1–2s. Volta para joelhos dobrados logo.', tip: 'Progressão natural para o back lever completo.', yt: 'lkGhntOoLNk', hasRecord: true, skillKey: 'bl', levelIdx: 1 },
  { id: 'car-shoulder', day: 3, name: 'Girar o ombro em círculo completo', nameEn: 'Shoulder CAR (Controlled Articular Rotation — rotação controlada do ombro)', sets: '2 × 5 cada lado', equip: ['chão'], how: 'Gira o ombro em círculo completo, devagar e com total controle. 5 para cada lado.', tip: 'Mantém o ombro saudável para o back lever a longo prazo.', yt: 'otLf0tw8vYE', hasRecord: false },
  { id: 'pike-stretch', day: 3, name: 'Esticar as pernas em pike sentado', nameEn: 'Seated Pike Stretch (alongamento dos isquiotibiais)', sets: '2 × 40s', equip: ['chão'], how: 'Senta com as pernas estendidas e inclina o tronco para frente. Segura 40s.', tip: 'Mobilidade importante para o L-sit e o press handstand.', yt: 'FwwWMkLMOJk', hasRecord: false },
  // SEXTA (day: 4)
  { id: 'hs-wall-back3', day: 4, name: 'HS — costas para a parede (sessão principal)', nameEn: 'Wall Handstand — Back to Wall (sessão mais longa da semana)', sets: '6 séries — máx segundos', equip: ['parede', 'chão'], how: 'A sessão mais longa de HS da semana. Em pelo menos uma série, tenta bater seu recorde pessoal.', tip: 'Sexta é o melhor dia para o handstand. O sistema nervoso está calibrado.', yt: 'stVj9X6RRFk', hasRecord: true, skillKey: 'hs', levelIdx: 0 },
  { id: 'hs-free3', day: 4, name: 'HS livre — mais tentativas', nameEn: 'Freestanding Handstand — Most Attempts (mais tentativas)', sets: '12 tentativas', equip: ['chão'], how: '12 tentativas com intenção. Hoje é o dia de arriscar mais do que qualquer outro dia.', tip: 'Tenta segurar mais do que qualquer outra sessão da semana.', yt: '7wkLRhW7e0A', hasRecord: true, skillKey: 'hs', levelIdx: 2 },
  { id: 'lsit-books2', day: 4, name: 'L-sit nos livros — mais volume', nameEn: 'L-sit on Books — More Volume (acumular 75s)', sets: '5 séries — acumula 75s', equip: ['livros'], how: '5 séries de máximo. Meta de 75s acumulados. Se na quarta você fez 60s, hoje tem que passar.', tip: 'A diferença de 15s de quarta para sexta é o que faz o progresso real.', yt: 'r-LQKNxGJB0', hasRecord: true, skillKey: 'lsit', levelIdx: 1 },
  { id: '90-maint', day: 4, name: '90° na parede — manutenção', nameEn: '90° Hold Maintenance (manutenção da base do press)', sets: '3 × 15s', equip: ['parede', 'chão'], how: '3 séries de 15s. Mantém o padrão da semana.', tip: 'Não precisa forçar hoje — é só manutenção.', yt: 'kShJnmKMaVc', hasRecord: false },
  { id: 'fl-maint', day: 4, name: 'Front Lever — manutenção', nameEn: 'Front Lever Tuck Maintenance (manutenção)', sets: '2 × 8s', equip: ['barra'], how: '2 séries de 8s. Sem forçar — é só para não perder o padrão.', tip: 'Qualidade acima de tudo. 8s perfeitos valem mais que 15s ruim.', yt: 'lkGhntOoLNk', hasRecord: false },
  { id: 'bl-maint', day: 4, name: 'Back Lever — manutenção', nameEn: 'Back Lever Tuck Maintenance (manutenção)', sets: '2 × 8s', equip: ['barra'], how: '2 séries de 8s. Mesma lógica do front lever.', tip: 'Ombros abaixo do corpo. Sempre.', yt: 'BwhZYpIdhro', hasRecord: false },
  { id: 'hollow3', day: 4, name: 'Bananinha no chão — finalizar', nameEn: 'Hollow Body Hold — Finisher (fechar a semana com core)', sets: '2 × 30s', equip: ['chão'], how: 'Fecha a semana com o core. 2 séries de 30s.', tip: 'Respira durante. Não prende.', yt: '2-3wv5kLNnw', hasRecord: false },
];

export const WEEK_DAYS = [
  { name: 'Segunda', icon: '🤸', focus: 'Handstand + Base da Flexão (90° Hold)', color: 'var(--accent)' },
  { name: 'Terça', icon: '⬆️', focus: 'Front Lever + Força de Suporte', color: 'var(--accent4)' },
  { name: 'Quarta', icon: '🪑', focus: 'Handstand + L-sit', color: 'var(--accent3)' },
  { name: 'Quinta', icon: '⬇️', focus: 'Back Lever + Mobilidade', color: 'var(--purple)' },
  { name: 'Sexta', icon: '🏆', focus: 'Handstand (melhor sessão) + Revisão', color: 'var(--accent2)' },
];

// ══════════════════════════════════════════════
// LABELS & CONSTANTS
// ══════════════════════════════════════════════

export const EQUIP_LABELS = {
  barra: 'Barra',
  parede: 'Parede',
  livros: 'Livros / Paralelas',
  chao: 'Chão'
};

export const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const GOAL_LABELS = {
  handstand: 'Dominar o Handstand',
  front_lever: 'Conquistar o Front Lever',
  back_lever: 'Conquistar o Back Lever',
  lsit: 'Conquistar o L-sit',
  forca: 'Ganhar força geral',
  mobilidade: 'Melhorar mobilidade',
  emagrecer: 'Emagrecer / definição'
};

export const LEVEL_LABELS = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado'
};

export const SKILL_META = {
  hs: { icon: '🤸', color: 'var(--accent)' },
  lsit: { icon: '🪑', color: 'var(--accent3)' },
  fl: { icon: '⬆️', color: 'var(--accent4)' },
  bl: { icon: '⬇️', color: 'var(--purple)' }
};

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const MONTH_NAMES_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
