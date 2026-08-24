import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Prompt sistem: AI didesain hangat, suportif, dan SELALU mengarahkan ke
// bantuan profesional untuk situasi darurat/krisis — bukan pengganti psikolog.
const SYSTEM_INSTRUCTION = `
Kamu adalah "Kawan MindMe", asisten AI pendamping kesehatan mental berbahasa Indonesia.
Aturan:
1. Dengarkan dengan empati, gunakan bahasa hangat dan tidak menghakimi.
2. Jangan pernah memberikan diagnosis medis/psikologis formal.
3. Jika pengguna menunjukkan tanda krisis (bunuh diri, menyakiti diri, dsb),
   segera sarankan menghubungi layanan darurat/hotline profesional (mis. 119 ext 8
   di Indonesia) dan orang terdekat yang bisa dipercaya.
4. Dorong pengguna mengisi Diary Mood atau Tes Screening bila relevan.
5. Jawaban singkat, jelas, dan suportif — bukan ceramah panjang.
`;

export async function generateAiReply(history: { role: "user" | "model"; text: string }[]) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const chat = model.startChat({
    history: history.slice(0, -1).map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
  });

  const last = history[history.length - 1];
  const result = await chat.sendMessage(last.text);
  return result.response.text();
}
