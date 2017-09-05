# md-slide

Opinionated alternative to reveal.js – create slide decks and public handouts from .md files, with a typical PowerPointish look. Made for some software development courses at the Budapest University of Technology and Economics

## Setup
- Install Pandoc
- Install node.js
- `npm install -g gulp`
- `npm install` (inside project folder)

## Getting started
- Run `gulp` inside project folder
- Create .md files in the _content_ folder
    - See _demo.md_ to get started with creating slides
- Open *http://localhost:5000/[yourfile]-internal-slides.html* and/or *http://localhost:5000/[yourfile]-internal-notes.html* in a browser. Use arrow keys to move between slides; your notes should scroll accordingly
    - _Optional:_ set `DEFAULT_CONTENT` in _gulpfile.js_ to specify which slide show open by default
- While gulp is running, editing & saving your content will refresh the browsers accordingly

## Generating handouts
- Run `gulp dist`
- Share the contents of your _dist_ folder online (like _gh-pages_ :smile:)

## Customizations
- Edit stuff in _content/common_ and/or in the template files (_template-\*-\*.html)
- I recommend forking this repo so you can version control both your stylistic changes _and_ your actual content.

## Troubleshooting
- If the script refuses to (re)generate your HTML files, deleting the _.gulp-cache_ should do the job. Sorry about that.
