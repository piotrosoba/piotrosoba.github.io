$(() => {
  const headerH1 = $('#header h1 div')
  const headerText = 'Piotr Osoba'
  const headerP = $('#header p')
  const titleText = 'Front End Developer'
  let i = 0

  headerH1.html('')

  const headerInterval = setInterval(() => {
    $('<div>' + headerText[i] + '</div>').appendTo(headerH1).hide().show('puff')
    i++
    if (i >= headerText.length) {
      clearInterval(headerInterval)
      $('<span>' + titleText + '</span>').appendTo(headerP).hide().delay(300).show('fade', 1500)
    }
  }, 200)
})