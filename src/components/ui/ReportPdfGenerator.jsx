import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { Button } from "./button";
import { HiDownload } from "react-icons/hi";
import { toast } from "sonner";

export async function ReportPdfGenerator({ elementId, filename = "report", title }) {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error("Report element not found");
    return;
  }

  try {
    toast.loading("Generating PDF...", { id: "pdf-generation" });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (title) {
      pdf.setFontSize(18);
      pdf.setTextColor(13, 42, 61);
      pdf.text(title, pageWidth / 2, 15, { align: "center" });
    }

    let heightLeft = imgHeight;
    let position = title ? 25 : 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF downloaded successfully", { id: "pdf-generation" });
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast.error("Failed to generate PDF", { id: "pdf-generation" });
  }
}
