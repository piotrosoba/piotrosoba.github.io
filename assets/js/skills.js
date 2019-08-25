const skills = $('.skills-icon')
const win = $(window)
const description = $('.skill-description')

skills.hide()


function showSkills(evt) {
  if (win.scrollTop() > skills.position().top + skills.height() / 2) {
    win.unbind()

    skills.each((index, el) => {
      $(el).delay(index * 300).show('size')
    })
  }
}

function showDescription(evt) {
  $('.skills-icon--active').removeClass('skills-icon--active')
  const skill = $(evt.target)
  skill.addClass('skills-icon--active')
  const text = skill.attr('alt')
  description.html('<p>' + text + '</p>')
}

skills.mouseenter(showDescription)
skills.click(showDescription)
win.scroll(showSkills)