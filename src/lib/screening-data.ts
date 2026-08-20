export const options = [
  { value: 0, label: "Tidak sama sekali" },
  { value: 1, label: "Beberapa hari" },
  { value: 2, label: "Lebih dari separuh hari" },
  { value: 3, label: "Hampir setiap hari" },
];

export const tests = {
  phq9: {
    id: "phq9",
    title: "PHQ-9",
    subtitle: "Skrining Depresi",
    emoji: "🌧️",
    description:
      "Patient Health Questionnaire-9 mengukur tingkat keparahan gejala depresi selama 2 minggu terakhir.",
    questions: [
      "Kurang minat atau kesenangan dalam melakukan sesuatu",
      "Merasa murung, sedih, atau putus asa",
      "Sulit tidur, mudah terbangun, atau justru tidur berlebihan",
      "Merasa lelah atau kurang bertenaga",
      "Nafsu makan berkurang atau berlebihan",
      "Merasa buruk tentang diri sendiri — merasa gagal atau mengecewakan orang lain",
      "Sulit berkonsentrasi, misalnya saat membaca atau menonton TV",
      "Bergerak/bicara sangat lambat, atau justru gelisah dan tidak bisa diam",
      "Berpikir bahwa lebih baik mati atau menyakiti diri sendiri",
    ],
    ranges: [
      { max: 4, label: "Minimal", color: "#10b981" },
      { max: 9, label: "Ringan", color: "#84cc16" },
      { max: 14, label: "Sedang", color: "#f59e0b" },
      { max: 19, label: "Cukup Berat", color: "#f97316" },
      { max: 27, label: "Berat", color: "#ef4444" },
    ],
  },
  gad7: {
    id: "gad7",
    title: "GAD-7",
    subtitle: "Skrining Kecemasan",
    emoji: "🌪️",
    description:
      "Generalized Anxiety Disorder-7 mengukur tingkat keparahan gejala kecemasan selama 2 minggu terakhir.",
    questions: [
      "Merasa gugup, cemas, atau sangat tegang",
      "Tidak dapat menghentikan atau mengendalikan rasa khawatir",
      "Terlalu khawatir tentang berbagai hal",
      "Sulit untuk rileks",
      "Sangat gelisah sehingga sulit untuk diam",
      "Mudah kesal atau mudah marah",
      "Merasa takut seolah sesuatu yang buruk akan terjadi",
    ],
    ranges: [
      { max: 4, label: "Minimal", color: "#10b981" },
      { max: 9, label: "Ringan", color: "#84cc16" },
      { max: 14, label: "Sedang", color: "#f59e0b" },
      { max: 21, label: "Berat", color: "#ef4444" },
    ],
  },
} as const;

export type TestId = keyof typeof tests;

export function scoreResult(testId: TestId, total: number) {
  const test = tests[testId];
  return test.ranges.find((r) => total <= r.max) ?? test.ranges[test.ranges.length - 1];
}
