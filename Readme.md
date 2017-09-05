# md-slide

Opinionated alternative to reveal.js – create slide decks and public handouts from MarkDown files, with a typical PowerPointish look. I created it for some of my software development courses at the Budapest University of Technology and Economics, [Department of Automation and Applied Informatics](https://www.aut.bme.hu/en/default.aspx), but it might be useful for anyone else as well.

## Setup
- Install [Pandoc](http://pandoc.org/installing.html)
- Install node.js
- `npm install -g gulp`
- `npm install` (inside project folder)

## Getting started
- Run `gulp` inside project folder
    - If you just cloned this repo, and installed everything properly, this should open the demonstration slide show and its notes in two separate Chrome tabs
    – Check out both so you can master creating _md-slide_ decks!
- Create .md files in the _content_ folder
    - See _demo.md_ as an example
- Open http://localhost:5000/[yourfile]-internal-slides.html and/or http://localhost:5000/[yourfile]-internal-notes.html in a browser.
    - _Optional:_ set `DEFAULT_CONTENT` in _gulpfile.js_ to specify which slide show should open by default
- Use the arrow keys to move between slides; your notes should scroll accordingly
- While gulp is running, editing & saving your content will cause the browser(s) to refresh, making it easy to check out your changes

## Generating handouts
- Run `gulp dist`
- Share the contents of your _dist_ folder online (like _gh-pages_ :smile:)

## Customizations
- Edit stuff in _content/common_ and/or in the template files (_template-\*-\*.html_)
- I recommend forking this repo, so you can version control both your stylistic changes _and_ your actual content.

## Troubleshooting
- If the script refuses to (re)generate your HTML files, deleting the _.gulp-cache_ should do the job. Sorry about that.
