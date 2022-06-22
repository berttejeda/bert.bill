import base64
import os
import markdown
from bertdotbill.extensions import NewTabExtension
from jinja2 import Template
from bertdotbill.logger import Logger
from bertdotwebadapter import WebAdapter

logger = Logger().init_logger(__name__)

class Lessons:

  def __init__(self, args, settings, **kwargs):
    self.args = args
    self.settings = settings
    self.webadapter = WebAdapter(fail_on_errors=True, verify_tls=self.args.verify_tls)
    self.global_username = os.environ.get(
      'GLOBAL_USERNAME') or self.args.username  # or self.config_util.get(self.settings,'auth.global.username')
    self.global_password = os.environ.get(
      'GLOBAL_PASSWORD') or self.args.password  # or self.config_util.get(self.settings,'auth.global.password')

  def encode_lesson(self, rendered_lesson):
      rendered_lesson_bytes = rendered_lesson.encode("utf-8")
      encoded_lesson = base64.b64encode(rendered_lesson_bytes)
      return encoded_lesson.decode("utf-8")

  def render_lesson(self, lesson_url, lesson_content, norender_markdown=False):

    initial_data = {
      'environment': os.environ
    }
    lesson_content = str(lesson_content)
    lesson_content = lesson_content.strip()
    lesson_template = Template(lesson_content)
    try:
      rendered_lesson = lesson_template.render(
        session=initial_data
      )
    except Exception as e:
      err = str(e)
      logger.error('I had trouble rendering the lesson at %s, error was %s' % (lesson_url, err))
      rendered_lesson = ('''
        <div class="lesson-error-container">
          <div class="lesson-error-text">
          Error in rendering lesson at %s:<br /> %s
          </div>
        </div>
        ''' % (lesson_url, err)
                         )
      return rendered_lesson
    if norender_markdown:
      return rendered_lesson
    else:
      rendered_lesson = markdown.markdown(rendered_lesson,
                                          extensions=[NewTabExtension(),
                                                      'markdown.extensions.admonition',
                                                      'markdown.extensions.attr_list',
                                                      'markdown.extensions.codehilite',
                                                      'markdown.extensions.toc',
                                                      'pymdownx.emoji',
                                                      'pymdownx.details']
                                          )
      return rendered_lesson

  # TODO: lesson_url should be renamed to lesson_url
  def load_lesson(self, lesson_url, no_ui=False, norender_markdown=False):
    lesson_url = os.environ.get('lesson_url') or lesson_url
    res_ok = False
    # TODO: Employ per-lesson credentials
    if not no_ui:
      try:
        res = self.webadapter.get(lesson_url,
                                  username=self.global_username,
                                  password=self.global_password,
                                  cache_path='.')
        res_ok = True
      except Exception as e:
        err = str(e)
        logger.error('I had trouble retrieving the lesson at %s, error was %s' % (lesson_url, err))
        html_err_message = '''
          <div class="lesson-error-container">
            <div class="lesson-error-text">
            I had trouble retrieving the lesson at %s<br />
            Error was: %s<br />
            </div>
          </div>
        ''' % (lesson_url, err)
        encoded_lesson = self.encode_lesson(html_err_message)
      if res_ok:
        lesson_content = res
        logger.info('Attempting to render and encode lesson at %s' % lesson_url)
        rendered_lesson = self.render_lesson(lesson_url, lesson_content, norender_markdown=norender_markdown)
        logger.debug(rendered_lesson)
        try:
          encoded_lesson = self.encode_lesson(rendered_lesson)
        except Exception as e:
          err = str(e)
          logger.error('I had trouble encoding the lesson at %s' % lesson_url, err)
          html_err_message = '''
            <div class="lesson-error-container">
              <div class="lesson-error-text">
              I had trouble encoding the lesson at %s<br />
              Error was: %s
              </div>
            </div>
          ''' % (lesson_url, err)
          encoded_lesson = self.encode_lesson(html_err_message)
      encoded_lesson_obj = {'encodedLesson': encoded_lesson }
      return(encoded_lesson_obj)
    else:
      res = self.webadapter.get(lesson_url,
                                username=self.global_username,
                                password=self.global_password,
                                cache_path='.')
      lesson_content = str(res)
      rendered_lesson = self.render_lesson(lesson_content, norender_markdown=norender_markdown)
      print(rendered_lesson)

  def save_content(self, content):
    filename = self.webview.windows[0].create_file_dialog(self.webview.SAVE_DIALOG)
    if not filename:
      return

    with open(filename, 'w') as f:
      f.write(content)