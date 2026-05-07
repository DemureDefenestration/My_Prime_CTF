content = open('LandingPage.css').read()
content = content.replace(
'''  background:
    radial-gradient(circle at top left, rgba(120, 0, 0, 0.65) 0%, rgba(35, 0, 0, 0.28) 18%, rgba(0, 0, 0, 0.08) 32%, #000000 60%),
    #000000;''',
'''  background:
    radial-gradient(circle at top left, rgba(120, 0, 0, 0.65) 0%, rgba(35, 0, 0, 0.28) 200px, rgba(0, 0, 0, 0.08) 400px, #000000 700px),
    #000000;'''
)

content = content.replace(
'''  background:
    radial-gradient(circle at top left, rgba(180, 0, 0, 0.78) 0%, rgba(70, 0, 0, 0.36) 16%, rgba(0, 0, 0, 0.10) 34%, #000000 62%),
    #000000;''',
'''  background:
    radial-gradient(circle at top left, rgba(180, 0, 0, 0.78) 0%, rgba(70, 0, 0, 0.36) 200px, rgba(0, 0, 0, 0.10) 400px, #000000 700px),
    #000000;'''
)

content = content.replace(
'''  background:
  radial-gradient(circle at top left,  rgba(180, 0, 0, 0.78), 0%, rgba(255, 79, 79, 0.36), 16%, rgba(255, 255, 255, 0.1) 34%, #ffffff 62%),
  #ffffff;''',
'''  background:
  radial-gradient(circle at top left, rgba(180, 0, 0, 0.78) 0%, rgba(255, 79, 79, 0.36) 200px, rgba(255, 255, 255, 0.1) 400px, #ffffff 700px),
  #ffffff;'''
)

content = content.replace(
'''  .modal-text-overlay {
    position: absolute;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 88%;
    display: flex;
    align-items: flex-start; /* anchor to top so content doesn't jump */
    justify-content: flex-start;
    color: #1a1a1a;
    font-size: 18px;
    font-family: "Caveat", serif;
    line-height: 1.6;
    text-align: justify;
    padding: 20px 30px;
    overflow: hidden; /* we'll manage overflow for typing */
    word-wrap: break-word;
    white-space: pre-wrap;
    background: transparent !important;
  }''',
'''  .modal-text-overlay {
    position: absolute;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 88%;
    display: flex;
    align-items: flex-start; /* anchor to top so content doesn't jump */
    justify-content: flex-start;
    color: #1a1a1a;
    font-size: 18px;
    font-family: "Caveat", serif;
    line-height: 1.6;
    text-align: justify;
    padding: 20px 30px;
    overflow-y: auto;
    word-wrap: break-word;
    white-space: pre-wrap;
    background: transparent !important;
  }'''
)

content = content.replace(
'''  /* Typed text styling */
  .typed-text {
    font-size: 40px; /* 1.5x larger */
    line-height: 1.4;
    max-height: 330px; /* increased proportionally */
    overflow: hidden;
    width: 100%;
    text-align: left;
    font-family: 'Caveat', serif;
  }''',
'''  /* Typed text styling */
  .typed-text {
    font-size: 40px; /* 1.5x larger */
    line-height: 1.4;
    width: 100%;
    text-align: left;
    font-family: 'Caveat', serif;
  }'''
)

open('LandingPage.css', 'w').write(content)
print('Done!')
