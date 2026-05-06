import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Renders a hidden DOM node and exports to credit-card sized PDF (front+back)
export async function exportCardToPdf(frontEl: HTMLElement, backEl: HTMLElement, refNumber: string) {
  const opts = { scale: 3, backgroundColor: null, useCORS: true } as const;
  const front = await html2canvas(frontEl, opts);
  const back = await html2canvas(backEl, opts);

  // 85.6mm x 54mm card; place both on A4 with bleed
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const cardW = 85.6, cardH = 54;
  const pageW = pdf.internal.pageSize.getWidth();
  const x = (pageW - cardW) / 2;
  pdf.addImage(front.toDataURL("image/png"), "PNG", x, 30, cardW, cardH, undefined, "FAST");
  pdf.addImage(back.toDataURL("image/png"), "PNG", x, 30 + cardH + 10, cardW, cardH, undefined, "FAST");
  pdf.setFontSize(9);
  pdf.setTextColor(120);
  pdf.text(`KSITM ID Card · ${refNumber}`, pageW / 2, 25, { align: "center" });
  pdf.save(`KSITM-IDCard-${refNumber}.pdf`);
}
