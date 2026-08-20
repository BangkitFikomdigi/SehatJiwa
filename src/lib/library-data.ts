export type Article = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  emoji: string;
};

// Dalam produksi, data ini bisa dipindah ke tabel Supabase `articles`.
// Untuk saat ini disimpan sebagai konstanta dan di-cache lewat Upstash Redis
// agar endpoint /api/library tidak query berulang-ulang.
export const articles: Article[] = [
  { id: "1", title: "Mengenal Anxiety Disorder dan Cara Mengatasinya", category: "Kecemasan", excerpt: "Kecemasan berlebih memengaruhi jutaan orang. Kenali gejala dan strategi coping yang terbukti efektif.", readTime: "6 menit", emoji: "😰" },
  { id: "2", title: "Pentingnya Self-Compassion di Tengah Tekanan", category: "Self-Care", excerpt: "Belajar bersikap lembut pada diri sendiri sama pentingnya dengan produktivitas.", readTime: "4 menit", emoji: "💗" },
  { id: "3", title: "Memahami Burnout dan Cara Pulih Darinya", category: "Kerja", excerpt: "Burnout bukan hanya lelah biasa. Ini tanda-tanda dan langkah pemulihannya.", readTime: "7 menit", emoji: "🔥" },
  { id: "4", title: "Teknik Grounding 5-4-3-2-1 untuk Panic Attack", category: "Kecemasan", excerpt: "Latihan sederhana berbasis panca indera untuk meredakan serangan panik.", readTime: "3 menit", emoji: "🌬️" },
  { id: "5", title: "Membangun Kebiasaan Tidur yang Sehat", category: "Tidur", excerpt: "Sleep hygiene yang baik berdampak besar pada suasana hati dan fokus.", readTime: "5 menit", emoji: "😴" },
  { id: "6", title: "Cara Mendukung Teman yang Sedang Berjuang", category: "Relasi", excerpt: "Panduan praktis mendengarkan tanpa menghakimi dan kapan harus merujuk ke profesional.", readTime: "6 menit", emoji: "🤝" },
];
