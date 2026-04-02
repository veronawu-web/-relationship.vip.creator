
import { Node, Link } from './types';

export const NODES: Node[] = [
  // --- Core Anchors (Streamers) ---
  { id: 'chinchin1010', name: '金金 (chinchin)', group: 'core', val: 55 },
  { id: 'yuansi9551429', name: 'Baby (yuansi)', group: 'core', val: 50 },
  { id: 'stellajs', name: 'Stella', group: 'core', val: 40 },
  { id: 'neinei_chen', name: '內內 (neinei)', group: 'core', val: 45 },
  { id: 'lovelyamber', name: 'Amber', group: 'core', val: 42 },
  { id: 'tizzybb', name: '踢踢 (tizzy)', group: 'core', val: 38 },
  { id: 'belene.', name: '糖糖 (belene)', group: 'core', val: 35 },
  { id: 'ruan.ccc', name: 'Ruan', group: 'core', val: 30 },
  { id: 'sexyrabbitt', name: 'Sexy Rabbit', group: 'core', val: 32 },
  { id: 'lin_soda', name: 'Soda', group: 'core', val: 28 },

  // --- High Intensity (Red/Pink) ---
  { id: 'hpwwph21', name: '21 (hpwwph)', group: 'high', val: 45, lastMessage: '可以不要放棄我嗎？我真的不能沒有你..' },
  { id: 'aa6655891', name: '柳丁 (aa6655)', group: 'high', val: 42, lastMessage: 'Baby再講男主播我其實超級生氣' },
  
  // --- Support (Purple) ---
  { id: 'a.wen_3535', name: '35 (a.wen)', group: 'support', val: 32, lastMessage: '對啊，學習到很多，畢竟很少女生會和我聊這種事情' },
  { id: 'q888888qq', name: '小飛象', group: 'support', val: 25 },
  { id: 'pandaer0202', name: '胖達', group: 'support', val: 22 },
  { id: 'asx3024', name: '24愛踢踢', group: 'support', val: 20 },

  // --- Cool/Distant/Transactional (Blue) ---
  { id: 'jmarx5168', name: '五一六八 (jmarx)', group: 'cool', val: 38, lastMessage: '習慣性看一下她帳號，發現我被封鎖了' },
  { id: 'sky537', name: 'Sky', group: 'cool', val: 22, lastMessage: '有大哥包一一囉👍' },
  { id: 'aniki1991', name: '阿尼基', group: 'cool', val: 18, lastMessage: '會有甚麼哈哈哈，是該來收集一下' },
  { id: 'silkyfire8784', name: 'Nishikino', group: 'cool', val: 24, lastMessage: '妳跟21吵架了喔? 感覺21對妳很好捏' },
  { id: 'wsthepig', name: '凱凱 (pig)', group: 'cool', val: 15, lastMessage: '截圖一下我現在多少鑽石了' },
];

export const LINKS: Link[] = [
  // Chinchin Galaxy
  { source: 'hpwwph21', target: 'chinchin1010', value: 12, intensity: 0.98 },
  { source: 'a.wen_3535', target: 'chinchin1010', value: 8, intensity: 0.7 },
  { source: 'jmarx5168', target: 'chinchin1010', value: 5, intensity: 0.4 },
  { source: 'silkyfire8784', target: 'chinchin1010', value: 4, intensity: 0.3 },

  // Yuansi Galaxy
  { source: 'aa6655891', target: 'yuansi9551429', value: 10, intensity: 0.9 },
  
  // Stella Galaxy
  { source: 'aniki1991', target: 'stellajs', value: 4, intensity: 0.4 },

  // Amber & Tizzy (jmarx's other lines)
  { source: 'jmarx5168', target: 'lovelyamber', value: 6, intensity: 0.5 },
  { source: 'jmarx5168', target: 'tizzybb', value: 7, intensity: 0.6 },
  { source: 'jmarx5168', target: 'neinei_chen', value: 9, intensity: 0.8 }, // The "Blocked" line

  // Belene Galaxy
  { source: 'sky537', target: 'belene.', value: 5, intensity: 0.45 },

  // Ruan & Rabbit
  { source: 'silkyfire8784', target: 'ruan.ccc', value: 3, intensity: 0.2 },
  { source: 'silkyfire8784', target: 'sexyrabbitt', value: 3, intensity: 0.2 },

  // Soda Galaxy
  { source: 'wsthepig', target: 'lin_soda', value: 4, intensity: 0.3 },

  // Cross-Support
  { source: 'asx3024', target: 'tizzybb', value: 3, intensity: 0.3 },
  { source: 'q888888qq', target: 'chinchin1010', value: 2, intensity: 0.2 },
];
