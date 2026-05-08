import re
from typing import Tuple

import time
import requests
from bs4 import BeautifulSoup


WIKI_REGEX = re.compile(r"^https?://(\w+\.)?wikipedia\.org/", re.IGNORECASE)


class ScrapeError(Exception):
    pass


DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch_article_title(url: str) -> str:
    """Fetch only the article title for preview purposes."""
    if not url or not isinstance(url, str):
        raise ScrapeError("Invalid URL")
    
    if not WIKI_REGEX.match(url):
        raise ScrapeError("Only Wikipedia URLs are supported")
    
    try:
        resp = requests.get(url, headers=DEFAULT_HEADERS, timeout=10)
        if resp.status_code != 200:
            raise ScrapeError(f"Failed to fetch article: HTTP {resp.status_code}")
        
        soup = BeautifulSoup(resp.text, "html.parser")
        title_tag = soup.find(id="firstHeading")
        title = title_tag.get_text(strip=True) if title_tag else "Wikipedia Article"
        return title
    except requests.RequestException as exc:
        raise ScrapeError(f"Request failed: {exc}")


def fetch_and_clean_article(url: str) -> Tuple[str, str, str]:
    if not url or not isinstance(url, str):
        raise ScrapeError("Invalid URL")

    if not WIKI_REGEX.match(url):
        raise ScrapeError("Only Wikipedia URLs are supported")

    try:
        # Some Wikipedia endpoints return 403 without a browser-like User-Agent
        # Retry small times on 403/429
        last_exc = None
        for attempt in range(3):
            try:
                resp = requests.get(url, headers=DEFAULT_HEADERS, timeout=20)
            except requests.RequestException as exc:
                last_exc = exc
                break
            if resp.status_code in (403, 429):
                time.sleep(0.8 * (attempt + 1))
                continue
            break
        else:
            # loop exhausted; use last response
            pass
    except requests.RequestException as exc:
        raise ScrapeError(f"Request failed: {exc}")

    if resp.status_code != 200 or not resp.text:
        raise ScrapeError(f"Failed to fetch article: HTTP {resp.status_code}")

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title
    title_tag = soup.find(id="firstHeading")
    title = title_tag.get_text(strip=True) if title_tag else "Wikipedia Article"

    # Main content
    content = soup.find(id="mw-content-text")
    if not content:
        raise ScrapeError("Could not locate article content")

    # Remove tables, infoboxes, references, navboxes
    for selector in [
        ".infobox", ".vertical-navbox", ".navbox", ".metadata",
        ".reference", "table", ".toc", "style", "script"
    ]:
        for el in content.select(selector):
            el.decompose()

    # Gather paragraphs
    paragraphs = [p.get_text(" ", strip=True) for p in content.find_all("p")]
    text = "\n\n".join(p for p in paragraphs if p)

    if len(text) < 200:
        raise ScrapeError("Article too short or failed to parse")

    return title, text, resp.text  # Return title, cleaned text, and raw HTML

