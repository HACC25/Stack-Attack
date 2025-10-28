from pypdf import PdfReader


class Page:
    def __init__(self, content: str | None):
        self.content: str = content or ""


def load_pages(file_path: str) -> list[Page]:
    reader = PdfReader(file_path)
    pages: list[Page] = []
    for i, page in enumerate(reader.pages):
        pages.append(Page(content=page.extract_text()))

    return pages
