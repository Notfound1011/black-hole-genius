import { GoogleGenAI } from "@google/genai";
import { Phase, RemnantType, MASS_THRESHOLD_BLACK_HOLE } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchExplanation = async (
  phase: Phase,
  mass: number,
  isTeacherMode: boolean
): Promise<string> => {
  const remnantType = mass >= MASS_THRESHOLD_BLACK_HOLE ? "黑洞 (Black Hole)" : "中子星 (Neutron Star)";
  
  let context = "";
  if (phase === Phase.Remnant) {
    context = `当前恒星初始质量为 ${mass}倍太阳质量，最终演化结果是 ${remnantType}。`;
  } else {
    context = `当前恒星初始质量为 ${mass}倍太阳质量。`;
  }

  const audience = isTeacherMode 
    ? "物理系大学生 (需要更深入的物理机制，如简并压、史瓦西半径、广义相对论效应)" 
    : "高中生 (通俗易懂，多用比喻，强调引力平衡)";

  const prompt = `
    你是一个天体物理学教育AI助手。请为"黑洞形成演示"工具生成一段解说词。
    
    当前阶段: ${phase}
    受众: ${audience}
    模拟上下文: ${context}
    
    要求:
    1. 语言生动、准确，中文输出。
    2. 字数限制在120字以内。
    3. 如果是主序星阶段，强调引力与核聚变压力的平衡。
    4. 如果是红超巨星，强调体积膨胀和核心收缩。
    5. 如果是超新星，描述剧烈的爆炸。
    6. 如果是遗迹阶段，根据质量解释为什么形成了黑洞(引力大于中子简并压)或者中子星。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "无法生成解说，请检查网络连接。";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "AI 助手暂时离线，请参考默认解说。";
  }
};
