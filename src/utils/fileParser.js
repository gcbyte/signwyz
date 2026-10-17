import * as pdfjsLib from "pdfjs-dist"
import mammoth from "mammoth"

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

/**
 * Extracts plain text from a File object.
 * Supports .txt, .pdf, and .docx files.
 *
 * @param {File} file
 * @returns {Promise<string>} The extracted text content.
 * @throws {Error} With a user-friendly message if extraction fails.
 */
export async function extractTextFromFile(file) {
  if (file.type === "text/plain") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target.result)
      reader.onerror = () => reject(new Error("We could not read this file. Please try another."))
      reader.readAsText(file)
    })
  }

  if (file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let extractedText = ""

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item) => item.str).join(" ")
      extractedText += pageText + "\n"
    }

    return extractedText
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  }

  throw new Error(
    "Old-format .doc files aren't supported. Please save it as .docx, upload a PDF or .txt file, or paste the text below."
  )
}
