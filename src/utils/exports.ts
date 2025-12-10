import { jsPDF } from 'jspdf';
import ical, { ICalCalendar } from 'ical-generator';
import type { Route } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function generateGoogleMapsUrl(route: Route): string {
  const firstPoint = route.points[0];
  const lastPoint = route.points[route.points.length - 1];

  // Create a Google Maps directions URL
  const baseUrl = 'https://www.google.com/maps/dir/';
  const origin = `${firstPoint.lat},${firstPoint.lng}`;
  const destination = `${lastPoint.lat},${lastPoint.lng}`;
  const waypointParams = route.points
    .slice(1, -1)
    .map((p) => `${p.lat},${p.lng}`)
    .join('/');

  return `${baseUrl}${origin}/${waypointParams}/${destination}`;
}

export function generatePDF(route: Route): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(196, 30, 58); // Christmas red
  doc.text('Weihnachts-Route München', pageWidth / 2, yPos, {
    align: 'center',
  });
  yPos += 15;

  // Date and info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const dateStr = format(route.preferences.date, 'dd. MMMM yyyy', {
    locale: de,
  });
  doc.text(`Datum: ${dateStr}`, margin, yPos);
  yPos += 7;
  doc.text(
    `Zeitrahmen: ${route.preferences.startTime} - ${route.preferences.endTime} Uhr`,
    margin,
    yPos
  );
  yPos += 7;
  doc.text(`Personen: ${route.persons.length}`, margin, yPos);
  yPos += 7;
  doc.text(
    `Gesamtdauer: ${Math.floor(route.totalDuration / 60)}h ${route.totalDuration % 60}min`,
    margin,
    yPos
  );
  yPos += 7;
  doc.text(`Gesamtstrecke: ${route.totalDistance} km`, margin, yPos);
  yPos += 7;
  doc.text(`Geschätzte Kosten: ${route.estimatedCost}€`, margin, yPos);
  yPos += 15;

  // Route points
  doc.setFontSize(14);
  doc.setTextColor(22, 91, 51); // Christmas green
  doc.text('Routenpunkte:', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  route.points.forEach((point, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${point.name}`, margin, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'normal');
    doc.text(`   ${point.address}`, margin, yPos);
    yPos += 5;

    const descLines = doc.splitTextToSize(
      `   ${point.description}`,
      pageWidth - 2 * margin
    );
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 5;

    doc.text(`   Dauer: ${point.duration} Min`, margin, yPos);
    yPos += 5;
    doc.text(
      `   Kosten: ${point.estimatedCost || 0}€`,
      margin,
      yPos
    );
    yPos += 5;

    if (point.christmasFeatures.length > 0) {
      doc.text(
        `   ⭐ ${point.christmasFeatures.join(', ')}`,
        margin,
        yPos
      );
      yPos += 5;
    }

    yPos += 5; // Extra space between points
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Erstellt mit Weihnachts-Routen-Planer München - Seite ${i} von ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const filename = `Weihnachtsroute_${format(route.preferences.date, 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
}

export function generateICS(route: Route): void {
  const calendar: ICalCalendar = ical({
    name: 'Weihnachts-Route München',
    description: 'Ihre persönliche Weihnachtsroute durch München',
  });

  const routeDate = route.preferences.date;
  let currentTime = new Date(routeDate);
  const [startHour, startMinute] = route.preferences.startTime
    .split(':')
    .map(Number);
  currentTime.setHours(startHour, startMinute, 0);

  route.points.forEach((point) => {
    const endTime = new Date(currentTime.getTime() + point.duration * 60000);

    calendar.createEvent({
      start: currentTime,
      end: endTime,
      summary: point.name,
      description: `${point.description}\n\nWeihnachts-Features: ${point.christmasFeatures.join(', ')}\nGeschätzte Kosten: ${point.estimatedCost || 0}€`,
      location: point.address,
      url: `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`,
    });

    currentTime = endTime;
  });

  // Create download
  const blob = new Blob([calendar.toString()], {
    type: 'text/calendar;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Weihnachtsroute_${format(routeDate, 'yyyy-MM-dd')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
