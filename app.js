const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs").promises;

async function generatePdf(templatePath, outputPath, name) {
  // Read the template PDF
  const templateBytes = await fs.readFile(templatePath);

  // Load the template PDF
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPage(0); // Assuming you want to modify the first page

  // Set font and font size
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.setFont(font);

  const { width } = page.getSize();

  // Write name
  page.setFontSize(42);
  // Calculate the center coordinates
  const nameTextWidth = font.widthOfTextAtSize(name, 42);
  const nameCenterX = (width - nameTextWidth) / 2;
  // Draw
  page.drawText(name, {
    x: nameCenterX,
    y: 540,
    color: rgb(1, 0.749, 0),
  });

  // Write date
  page.setFontSize(16);
  const dateText = getCurrentDate();
  // Calculate the center coordinates
  const dateTextWidth = font.widthOfTextAtSize(dateText, 16);
  const dateCenterX = (width - dateTextWidth) / 2;
  // Draw
  page.drawText(dateText, {
    x: dateCenterX,
    y: 405,
    color: rgb(1, 0.749, 0),
  });

  // Save the modified PDF
  const modifiedPdfBytes = await pdfDoc.save();
  await createFolderIfNotExists(outputPath);
  await fs.writeFile(outputPath + "/result.pdf", modifiedPdfBytes);
}

const templatePath = "input/template.pdf";
const outputPath = "output";
const name = "Johnny Sins";

generatePdf(templatePath, outputPath, name)
  .then(() => console.log("PDF generated successfully"))
  .catch((error) => console.error("Error generating PDF:", error));

async function createFolderIfNotExists(folderPath) {
  try {
    // Check if the folder exists
    await fs.access(folderPath);
  } catch (error) {
    // Folder doesn't exist, create it
    await fs.mkdir(folderPath);
  }
}

function getCurrentDate() {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = currentDate.getFullYear();

  return `${day}/${month}-${year}`;
}
