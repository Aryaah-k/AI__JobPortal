import PyPDF2


def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF using PyPDF2.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        str: Concatenated text of all pages.
    """
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text