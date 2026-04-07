
import { Node, Link } from './types';

export const NODES: Node[] = [
  // --- Core Anchors (Streamers) ---
  { id: 'chinchin1010', name: 'chinchin1010', group: 'core', val: 60 },
  { id: 'yuansi9551429', name: 'yuansi9551429', group: 'core', val: 55 },
  { id: 'stellajs', name: 'stellajs', group: 'core', val: 45 },
  { id: 'neinei_chen', name: 'neinei_chen', group: 'core', val: 48 },
  { id: 'lovelyamber', name: 'lovelyamber', group: 'core', val: 42 },
  { id: 'tizzybb', name: 'tizzybb', group: 'core', val: 40 },
  { id: 'belene.', name: 'belene.', group: 'core', val: 38 },
  { id: 'ruan.ccc', name: 'ruan.ccc', group: 'core', val: 35 },
  { id: 'pinksweetbaby', name: 'pinksweetbaby', group: 'core', val: 36 },
  { id: 'woolice42', name: 'woolice42', group: 'core', val: 30 },

  // --- High Intensity (Red/Pink) - Anxiety/Dependency ---
  { id: 'hpwwph21', name: 'hpwwph21', group: 'high', val: 50, lastMessage: '可以不要放棄我嗎🥹 我真的不能沒有你.. 沒有你我走不下去' },
  { id: 'aa6655891', name: 'aa6655891', group: 'high', val: 48, lastMessage: 'Baby再講男主播我其實超級生氣，東煮極力的在反對' },
  { id: 'kusoohoh0903', name: 'kusoohoh0903', group: 'high', val: 45, lastMessage: '600了不起喔，600不用回喔，妳不是我葵葵了' },
  
  // --- Support (Purple) - Stable/Empathy ---
  { id: 'a.wen_3535', name: 'a.wen_3535', group: 'support', val: 35, lastMessage: '對啊，學習到很多，畢竟很少女生會和我聊這種事情' },
  { id: 'pandaer0202', name: 'pandaer0202', group: 'support', val: 32, lastMessage: '因為我本人真的就不太會說話 所以我都用做的🤭' },
  { id: 'q888888qq', name: 'q888888qq', group: 'support', val: 28, lastMessage: 'OKOK 忙完再去你那聊天' },
  { id: 'chun07002', name: 'chun07002', group: 'support', val: 25, lastMessage: '我突然感受到背後涼涼的，難道我在線上被發現' },

  // --- Cool/Distant/Transactional (Blue) - Loss/Distant ---
  { 
    id: 'jmarx5168', 
    name: 'jmarx5168', 
    group: 'cool', 
    val: 42, 
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
  { id: 'sky537', name: 'sky537', group: 'cool', val: 24, lastMessage: '沒問題有大哥包一一囉👍' },
  { id: 'aniki1991', name: 'aniki1991', group: 'cool', val: 22, lastMessage: '什麼秘密 要花100萬鑽鑽來聽哈哈哈' },
  { id: 'silkyfire8784', name: 'silkyfire8784', group: 'cool', val: 26, lastMessage: '妳跟21吵架了喔? 感覺21對妳很好捏' },
];

export const LINKS: Link[] = [
  // chinchin1010 Galaxy
  { source: 'hpwwph21', target: 'chinchin1010', value: 15, intensity: 0.99, lastMessage: '可以不要放棄我嗎🥹 我真的不能沒有你.. 沒有你我走不下去' },
  { source: 'a.wen_3535', target: 'chinchin1010', value: 10, intensity: 0.75, lastMessage: '對啊，學習到很多，畢竟很少女生會和我聊這種事情' },
  { source: 'jmarx5168', target: 'chinchin1010', value: 8, intensity: 0.5, lastMessage: '21哥真是細膩又溫暖的人' },
  { source: 'pandaer0202', target: 'chinchin1010', value: 7, intensity: 0.6, lastMessage: '因為我本人真的就不太會說話 所以我都用做的🤭' },
  { source: 'q888888qq', target: 'chinchin1010', value: 5, intensity: 0.4, lastMessage: 'OKOK 忙完再去你那聊天' },
  { source: 'silkyfire8784', target: 'chinchin1010', value: 4, intensity: 0.3, lastMessage: '妳跟21吵架了喔? 感覺21對妳很好捏' },

  // yuansi9551429 Galaxy
  { source: 'aa6655891', target: 'yuansi9551429', value: 12, intensity: 0.92, lastMessage: 'Baby再講男主播我其實超級生氣，東煮極力的在反對' },
  { source: 'jmarx5168', target: 'yuansi9551429', value: 6, intensity: 0.45, lastMessage: '謝謝娘娘的安慰，有你真好' },

  // stellajs Galaxy
  { source: 'aniki1991', target: 'stellajs', value: 5, intensity: 0.4, lastMessage: '9487 會有甚麼哈哈哈 是該來收集一下' },
  { source: 'chun07002', target: 'stellajs', value: 4, intensity: 0.35, lastMessage: '我突然感受到背後涼涼的，難道我在線上被發現' },
  { source: 'jmarx5168', target: 'stellajs', value: 7, intensity: 0.6, lastMessage: '一姐，有事相託，最近內內不太理我' },

  // neinei_chen Galaxy
  { source: 'aniki1991', target: 'neinei_chen', value: 6, intensity: 0.5, lastMessage: '什麼秘密 要花100萬鑽鑽來聽哈哈哈' },
  { source: 'jmarx5168', target: 'neinei_chen', value: 9, intensity: 0.85, lastMessage: '這筆一對一的約定是 3/9 達成的，至今已經過了 12 天都沒有履行' },

  // pinksweetbaby Galaxy
  { source: 'kusoohoh0903', target: 'pinksweetbaby', value: 10, intensity: 0.9, lastMessage: '600了不起喔，600不用回喔，妳不是我葵葵了' },
  { source: 'jmarx5168', target: 'pinksweetbaby', value: 5, intensity: 0.4, lastMessage: '妳那邊大神太多 我不好意思插嘴 哈' },

  // Others
  { source: 'jmarx5168', target: 'lovelyamber', value: 6, intensity: 0.55, lastMessage: '嗨 Amber 昨天看到妳很開心，但線路卡卡的' },
  { source: 'jmarx5168', target: 'tizzybb', value: 6, intensity: 0.55, lastMessage: '一言難盡啊，踢踢，怪我自己一股腦' },
  { source: 'jmarx5168', target: 'woolice42', value: 4, intensity: 0.4, lastMessage: '嗨嗨 主播 請問您約會在台中還是台北？' },
  { source: 'sky537', target: 'belene.', value: 5, intensity: 0.45, lastMessage: '沒問題有大哥包一一囉👍' },
  { source: 'silkyfire8784', target: 'ruan.ccc', value: 3, intensity: 0.25, lastMessage: '9487 94狂👀' },
];
