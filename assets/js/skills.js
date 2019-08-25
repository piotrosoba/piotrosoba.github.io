const skills = $('.skills-icon')
const win = $(window)
const description = $('.skill-description')

skills.hide()


function showSkills(evt) {
  if (win.scrollTop() > skills.position().top + 500) {
    win.unbind()

    skills.each((index, el) => {
      $(el).delay(index * 500).show('size')
    })
  }
}

function showDescription(evt) {
  const text = $(evt.target).attr('alt')
  // description.html('<p>' + text + '</p>')
}

skills.mouseenter(showDescription)
skills.click(showDescription)
win.scroll(showSkills)