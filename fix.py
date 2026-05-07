content = open('LandingPage.css').read()
content = content.replace(
'''  background:
    radial-gradient(circle at top left, rgba(120, 0, 0, 0.65) 0%, rgba(35, 0, 0, 0.28) 18vw, rgba(0, 0, 0, 0.08) 32vw, #000000 60vw),
    #000000;''',
'''  background:
    radial-gradient(circle at top left, rgba(120, 0, 0, 0.65) 0%, rgba(35, 0, 0, 0.28) 18%, rgba(0, 0, 0, 0.08) 32%, #000000 60%),
    #000000;'''
)

content = content.replace(
'''  background:
    radial-gradient(circle at top left, rgba(180, 0, 0, 0.78) 0%, rgba(70, 0, 0, 0.36) 16vw, rgba(0, 0, 0, 0.10) 34vw, #000000 62vw),
    #000000;''',
'''  background:
    radial-gradient(circle at top left, rgba(180, 0, 0, 0.78) 0%, rgba(70, 0, 0, 0.36) 16%, rgba(0, 0, 0, 0.10) 34%, #000000 62%),
    #000000;'''
)

content = content.replace(
'''  background:
  radial-gradient(circle at top left,  rgba(180, 0, 0, 0.78) 0%, rgba(255, 79, 79, 0.36) 16vw, rgba(255, 255, 255, 0.1) 34vw, #ffffff 62vw),
  #ffffff;''',
'''  background:
    radial-gradient(circle at top left, rgba(180, 0, 0, 0.78) 0%, rgba(255, 79, 79, 0.36) 16%, rgba(255, 255, 255, 0.1) 34%, #ffffff 62%),
    #ffffff;'''
)

open('LandingPage.css', 'w').write(content)
print('Phase 1 done')
