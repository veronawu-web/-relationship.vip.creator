
import { Node, Link } from './types';

export const NODES: Node[] = [
  // --- Core Anchors (Streamers) ---
  { id: 'chinchin1010', name: 'chinchin1010', group: 'core', val: 60, attachmentType: '核心主播' },
  { id: 'yuansi9551429', name: 'yuansi9551429', group: 'core', val: 55, attachmentType: '核心主播' },
  { id: 'stellajs', name: 'stellajs', group: 'core', val: 45, attachmentType: '核心主播' },
  { id: 'neinei_chen', name: 'neinei_chen', group: 'core', val: 48, attachmentType: '核心主播' },
  { id: 'lovelyamber', name: 'lovelyamber', group: 'core', val: 42, attachmentType: '核心主播' },
  { id: 'tizzybb', name: 'tizzybb', group: 'core', val: 40, attachmentType: '核心主播' },
  { id: 'belene.', name: 'belene.', group: 'core', val: 38, attachmentType: '核心主播' },
  { id: 'ruan.ccc', name: 'ruan.ccc', group: 'core', val: 35, attachmentType: '核心主播' },
  { id: 'pinksweetbaby', name: 'pinksweetbaby', group: 'core', val: 36, attachmentType: '核心主播' },
  { id: 'woolice42', name: 'woolice42', group: 'core', val: 30, attachmentType: '核心主播' },

  // --- Anxiety (焦慮型) - High Dependency ---
  { id: 'hpwwph21', name: 'hpwwph21', group: 'anxious', val: 50, attachmentType: '焦慮型 (Anxious)', lastMessage: '可以不要放棄我嗎🥹 我真的不能沒有你.. 沒有你我走不下去' },
  { id: 'aa6655891', name: 'aa6655891', group: 'anxious', val: 48, attachmentType: '焦慮型 (Anxious)', lastMessage: 'Baby再講男主播我其實超級生氣，東煮極力的在反對' },
  { id: 'kusoohoh0903', name: 'kusoohoh0903', group: 'anxious', val: 45, attachmentType: '焦慮型 (Anxious)', lastMessage: '600了不起喔，600不用回喔，妳不是我葵葵了' },
  
  // --- Secure (安全型) - Stable/Empathy ---
  { id: 'a.wen_3535', name: 'a.wen_3535', group: 'secure', val: 35, attachmentType: '安全型 (Secure)', lastMessage: '對啊，學習到很多，畢竟很少女生會和我聊這種事情' },
  { id: 'pandaer0202', name: 'pandaer0202', group: 'secure', val: 32, attachmentType: '安全型 (Secure)', lastMessage: '因為我本人真的就不太會說話 所以我都用做的🤭' },
  { id: 'q888888qq', name: 'q888888qq', group: 'secure', val: 28, attachmentType: '安全型 (Secure)', lastMessage: 'OKOK 忙完再去你那聊天' },
  { id: 'chun07002', name: 'chun07002', group: 'secure', val: 25, attachmentType: '安全型 (Secure)', lastMessage: '我突然感受到背後涼涼的，難道我在線上被發現' },
  { id: 'sky537', name: 'sky537', group: 'secure', val: 24, attachmentType: '安全型 (Secure)', lastMessage: '沒問題有大哥包一一囉👍' },
  { id: 'aniki1991', name: 'aniki1991', group: 'secure', val: 22, attachmentType: '安全型 (Secure)', lastMessage: '什麼秘密 要花100萬鑽鑽來聽哈哈哈' },
  { id: 'silkyfire8784', name: 'silkyfire8784', group: 'secure', val: 26, attachmentType: '安全型 (Secure)', lastMessage: '妳跟21吵架了喔? 感覺21對妳很好捏' },

  // --- Avoidant/Disorganized (逃避/混亂型) ---
  { 
    id: 'jmarx5168', 
    name: 'jmarx5168', 
    group: 'disorganized', 
    val: 42, 
    attachmentType: '混亂型 (Disorganized)',
    lastMessage: '習慣性看一下她帳號 發現我被封鎖了，我有點難過，失望',
    messages: [
      '21哥真是細膩又溫暖的人',
      '「也害怕太過依賴某位大哥」 我理解，所以我沒有跟她要求過任何回饋',
      '之前她賣票賣得不好 一直哭 我就心軟 丟了禮物 從此之後就沒完沒了',
      '今天起來 習慣性看一下她帳號 發現我被封鎖了',
      '但其實是因為 我沒有錢了',
      '她說她感覺我在控制她',
      '我至今不了解我給她什麼壓力',
      '付出數千萬鑽，從沒要求過約會或要求任何回饋，卻換來冷暴力'
    ]
  },
];

export const LINKS: Link[] = [
  // chinchin1010 Galaxy
  { 
    source: 'hpwwph21', 
    target: 'chinchin1010', 
    value: 15, 
    intensity: 0.99, 
    lastMessage: '可以不要放棄我嗎🥹 我真的不能沒有你.. 沒有你我走不下去',
    sentimentScore: 12, // Very Cold / Rejecting
    streamerMessages: [
      '21 金金真的放下了 你也放下好嗎',
      '對不起 我想好好工作',
      '你想聊天 我也可以陪你 只是我們別在見面了',
      '那是昨天 今天不會哭了',
      '金金已經是21的過去了',
      '我已經調適好自己 我真的放下了 對不起',
      '我真的只想好好工作 不在放感情下去'
    ]
  },
  { 
    source: 'a.wen_3535', 
    target: 'chinchin1010', 
    value: 10, 
    intensity: 0.75, 
    lastMessage: '對啊，學習到很多，畢竟很少女生會和我聊這種事情',
    sentimentScore: 68, // Warm / Supportive
    streamerMessages: [
      '21有找你嗎',
      '不要尷尬啦 本來就是我叫你做的北爛事哈哈',
      '乖乖 過去了 我們向前看會越來越好的',
      '你看看21才愛我四個月哈哈',
      '愛上主播很累的',
      '35晚安安安安🫶🏻',
      '你越來越幽默了 真是可愛'
    ]
  },
  { 
    source: 'jmarx5168', 
    target: 'chinchin1010', 
    value: 8, 
    intensity: 0.5, 
    lastMessage: '21哥真是細膩又溫暖的人',
    sentimentScore: 55, // Neutral / Friendly
    streamerMessages: [
      'line也封鎖了喔？',
      '不要去愛上主播',
      '不要多想了🥺你還有我們',
      '哈我那天也是把21封鎖',
      '那馬哥你跟21好像..😂',
      '想聊我都在喔',
      '我才要謝謝你 平常對我這麼好'
    ]
  },
  { source: 'pandaer0202', target: 'chinchin1010', value: 7, intensity: 0.6, lastMessage: '因為我本人真的就不太會說話 所以我都用做的🤭', sentimentScore: 45 },
  { source: 'q888888qq', target: 'chinchin1010', value: 5, intensity: 0.4, lastMessage: 'OKOK 忙完再去你那聊天', sentimentScore: 40 },
  { 
    source: 'silkyfire8784', 
    target: 'chinchin1010', 
    value: 4, 
    intensity: 0.3, 
    lastMessage: '妳跟21吵架了喔? 感覺21對妳很好捏',
    sentimentScore: 35, // Distant
    streamerMessages: [
      '沒有吵架那 只是很認真的拒絕他',
      '我也對他很好'
    ]
  },

  // yuansi9551429 Galaxy
  { 
    source: 'aa6655891', 
    target: 'yuansi9551429', 
    value: 12, 
    intensity: 0.92, 
    lastMessage: 'Baby再講男主播我其實超級生氣，東煮極力的在反對',
    sentimentScore: 72, // Passionate / Active
    streamerMessages: [
      '21說的',
      '你昨日幾點到家啊',
      '我這幾天一直處理自己私事',
      '我開玩笑的',
      '利用時間好嗎🤣',
      '獎勵送我一張性感照 還比較實際'
    ]
  },
  { source: 'jmarx5168', target: 'yuansi9551429', value: 6, intensity: 0.45, lastMessage: '謝謝娘娘的安慰，有你真好', sentimentScore: 50 },

  // stellajs Galaxy
  { 
    source: 'aniki1991', 
    target: 'stellajs', 
    value: 5, 
    intensity: 0.4, 
    lastMessage: '9487 會有甚麼哈哈哈 是該來收集一下',
    sentimentScore: 88, // Very Passionate / Exclusive
    streamerMessages: [
      '慶祝一下 這個月🙈🙈專屬',
      '有三部影片喔～～～～ 月底拍拍拍'
    ]
  },
  { source: 'chun07002', target: 'stellajs', value: 4, intensity: 0.35, lastMessage: '我突然感受到背後涼涼的，難道我在線上被發現', sentimentScore: 40 },
  { source: 'jmarx5168', target: 'stellajs', value: 7, intensity: 0.6, lastMessage: '一姐，有事相託，最近內內不太理我', sentimentScore: 45 },

  // neinei_chen Galaxy
  { source: 'aniki1991', target: 'neinei_chen', value: 6, intensity: 0.5, lastMessage: '什麼秘密 要花100萬鑽鑽來聽哈哈哈', sentimentScore: 50 },
  { source: 'jmarx5168', target: 'neinei_chen', value: 9, intensity: 0.85, lastMessage: '這筆一對一的約定是 3/9 達成的，至今已經過了 12 天都沒有履行', sentimentScore: 30 },

  // pinksweetbaby Galaxy
  { source: 'kusoohoh0903', target: 'pinksweetbaby', value: 10, intensity: 0.9, lastMessage: '600了不起喔，600不用回喔，妳不是我葵葵了', sentimentScore: 25 },
  { source: 'jmarx5168', target: 'pinksweetbaby', value: 5, intensity: 0.4, lastMessage: '妳那邊大神太多 我不好意思插嘴 哈', sentimentScore: 40 },

  // Others
  { 
    source: 'jmarx5168', 
    target: 'lovelyamber', 
    value: 6, 
    intensity: 0.55, 
    lastMessage: '嗨 Amber 昨天看到妳很開心，但線路卡卡的',
    sentimentScore: 85, // Very Passionate
    streamerMessages: [
      '不小心睡著了',
      '最近怎麼了呀 要跟我說說嗎',
      '要夢到我呦',
      '太霸氣了啦！！！',
      '我會帶給你滿滿的快樂不用擔心🫶🏻😻'
    ]
  },
  { 
    source: 'jmarx5168', 
    target: 'tizzybb', 
    value: 6, 
    intensity: 0.55, 
    lastMessage: '一言難盡啊，踢踢，怪我自己一股腦',
    sentimentScore: 65, // Warm
    streamerMessages: [
      '不會啦🤣🤣',
      '發生什麼事情惹！',
      '說出來會好一些的呀',
      '我再看看她怎麼了👀'
    ]
  },
  { source: 'jmarx5168', target: 'woolice42', value: 4, intensity: 0.4, lastMessage: '嗨嗨 主播 請問您約會在台中還是台北？', sentimentScore: 40 },
  { 
    source: 'sky537', 
    target: 'belene.', 
    value: 5, 
    intensity: 0.45, 
    lastMessage: '沒問題有大哥包一一囉👍',
    sentimentScore: 78, // Warm / Intimate
    streamerMessages: [
      '你在哪～～',
      '幫我開11睡覺',
      '真的好累',
      '謝謝哥哥❤️❤️明天回去小心'
    ]
  },
  { source: 'silkyfire8784', target: 'ruan.ccc', value: 3, intensity: 0.25, lastMessage: '9487 94狂👀', sentimentScore: 30 },
];
