$(() => {
  const form = $('.send-form')
  const inputs = $('.send-form__input')
  const submit = $('.send-form__submit')

  inputs.blur(evt => {
    if (evt.target.getAttribute('class').includes('error')) {
      if (!isFormValidate(inputs))
        $('.form-warning').remove()
    }
  })

  const isFormValidate = inputs => {
    let error = false
    $('.form-email-warning').remove()

    inputs.each((index, input) => {
      const name = input.getAttribute('name')
      input.classList.remove('input-error')

      if (!input.value) {
        error = true
        input.classList.add('input-error')
      }

      if (name === "_replyto") {
        if (!input.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          error = true
          input.classList.add('input-error')

          const emailWarning = $('<div class="form-email-warning" style="margin:-5px 0 0 0; height:0"><b style="color: red">Wrong email!</b></div>')
          $(input).parent().append(emailWarning)
        }

      }

    })

    return error
  }

  submit.click(evt => {
    $('.form-warning').remove()

    const isError = isFormValidate(inputs)

    if (isError) {
      evt.preventDefault()
      const warning = $('<div class="form-warning" style="height:0"><b style="color: red">Please fill correct all inputs.</b></div>')
      form.append(warning)
    }

  })
})