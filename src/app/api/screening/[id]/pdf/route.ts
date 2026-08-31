import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { screeningResults, user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import PDFDocument from "pdfkit";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

async function getUserId(): Promise<string> {
  if (SKIP_AUTH) return DUMMY_USER_ID;
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();

    // Cari screening result
    const result = await db
      .select()
      .from(screeningResults)
      .where(
        and(
          eq(screeningResults.id, params.id),
          eq(screeningResults.userId, userId)
        )
      )
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Screening tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get user data
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const screening = result[0];
    const userData0 = userData[0];

    // Generate PDF
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {});

    // Title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("SehatJiwa - Hasil Tes Screening", { align: "center" });

    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Tanggal: ${new Date(screening.createdAt).toLocaleDateString("id-ID")}`, {
        align: "center",
      });

    doc.moveDown(1);

    // User Info
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Informasi Pengguna");
    doc.fontSize(12).font("Helvetica");
    doc.text(`Nama: ${userData0?.name || "Pengguna"}`);
    doc.text(`Email: ${userData0?.email || "-"}`);

    doc.moveDown(1);

    // Test Result
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Hasil Tes");
    doc.fontSize(12).font("Helvetica");
    doc.text(`Jenis Tes: ${screening.testId === "phq9" ? "PHQ-9 (Depresi)" : "GAD-7 (Kecemasan)"}`);
    doc.text(`Skor Total: ${screening.totalScore}`);
    doc.text(`Tingkat Keparahan: ${screening.severity}`);

    doc.moveDown(1);

    // Severity Explanation
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Interpretasi:");
    doc.font("Helvetica");

    if (screening.testId === "phq9") {
      doc.text(
        "PHQ-9 mengukur tingkat depresi dengan skor 0-27. " +
          (screening.severity === "Ringan"
            ? "Skor Anda menunjukkan gejala depresi ringan."
            : screening.severity === "Sedang"
              ? "Skor Anda menunjukkan gejala depresi sedang. Pertimbangkan konsultasi dengan profesional."
              : "Skor Anda menunjukkan gejala depresi yang signifikan. Segera konsultasikan dengan profesional kesehatan mental.")
      );
    } else {
      doc.text(
        "GAD-7 mengukur tingkat kecemasan dengan skor 0-21. " +
          (screening.severity === "Ringan"
            ? "Skor Anda menunjukkan gejala kecemasan ringan."
            : screening.severity === "Sedang"
              ? "Skor Anda menunjukkan gejala kecemasan sedang. Pertimbangkan konsultasi dengan profesional."
              : "Skor Anda menunjukkan gejala kecemasan yang signifikan. Segera konsultasikan dengan profesional kesehatan mental.")
      );
    }

    doc.moveDown(1);

    // Footer
    doc.fontSize(10).font("Helvetica");
    doc.text(
      "Catatan: Hasil tes ini untuk referensi pribadi saja dan bukan pengganti diagnosis profesional.",
      { align: "center" }
    );

    doc.end();

    return new Promise((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="screening-${screening.testId}-${new Date().getTime()}.pdf"`,
            },
          })
        );
      });
    });
  } catch (error) {
    console.error("GET screening PDF error:", error);
    return NextResponse.json(
      { error: "Gagal generate PDF" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
