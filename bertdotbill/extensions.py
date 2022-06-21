"""
Based on https://github.com/kriwil/markdown-newtab
New Tab Extension for Python-Markdown
=====================================
Modify the behavior of specially-formatted links in Python-Markdown to open a in a new
window if and only if the 'href' attribute of these links begins with 'newtab+' 
This changes the HTML output to add target="_blank" to such elements.
Example:
[www.example.com](newtab+https://www.example.com)
"""

from markdown import Extension
from markdown.inlinepatterns import \
    LinkInlineProcessor, ReferenceInlineProcessor, AutolinkInlineProcessor, AutomailInlineProcessor, \
    ShortReferenceInlineProcessor, \
    LINK_RE, REFERENCE_RE, AUTOLINK_RE, AUTOMAIL_RE


class NewTabMixin(object):

    def handleMatch(self, m, data):
        el, start, end = super(NewTabMixin, self).handleMatch(m, data)
        if el is not None:
            current_href = el.get('href','')
            if current_href.startswith('newtab+'):
              new_href = current_href.replace('newtab+', '')
              el.set('href', new_href)
              el.set('target', '_blank')
        return el, start, end        

class NewTabLinkProcessor(NewTabMixin, LinkInlineProcessor):
    pass

class NewTabExtension(Extension):
    """Modifies HTML output to open links in a new tab."""

    def extendMarkdown(self, md):
        md.inlinePatterns.register(NewTabLinkProcessor(LINK_RE, md), 'link', 160)

def makeExtension(**kwargs):
    return NewTabExtension(**kwargs)