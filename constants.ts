import { Phase } from './types';

export const PHASE_CONFIG = {
  [Phase.MainSequence]: {
    title: "第一阶段：主序星 (Main Sequence)",
    subtitle: "引力与核聚变的平衡",
    defaultText: "这是一颗年轻的恒星，正处于青壮年时期。核心的氢正在聚变为氦，产生的巨大能量向外推，刚好抵消了向内的万有引力。这是一场完美的拔河比赛。",
    cameraDist: 10,
    color: "#FDB813"
  },
  [Phase.RedSupergiant]: {
    title: "第二阶段：红超巨星 (Red Supergiant)",
    subtitle: "燃料耗尽与急剧膨胀",
    defaultText: "核心的氢耗尽了，恒星开始燃烧更重的元素。核心收缩，但这导致外层急剧膨胀并冷却变红。它现在的体积大得惊人，足以吞噬地球轨道！",
    cameraDist: 18,
    color: "#FF4500"
  },
  [Phase.Supernova]: {
    title: "第三阶段：超新星爆发 (Supernova)",
    subtitle: "宇宙中最壮观的烟火",
    defaultText: "聚变停止了。没有了向外的压力，引力在瞬间赢得了胜利。核心在几分之一秒内坍缩，冲击波将外层物质猛烈地抛向太空，亮度瞬间超过整个星系。",
    cameraDist: 15,
    color: "#FFFFFF"
  },
  [Phase.Remnant]: {
    title: "第四阶段：最终遗迹 (Remnant)",
    subtitle: "死寂与新生",
    defaultText: "尘埃落定。如果原恒星质量足够大，留下的核心将是一个连光都无法逃脱的黑洞。否则，它将成为一颗密度极高的中子星。",
    cameraDist: 8,
    color: "#000000"
  }
};
