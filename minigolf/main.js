(function () {
  const isMobileDevice = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
  //CONFIG
  const BALL_START_POSITION_X = 50
  const BALL_RADIUS = 20 * (isMobileDevice ? 0.7 : 1)
  const BALL_VELOCITY = 10
  const DOT_RADIUS = 11 * (isMobileDevice ? 0.7 : 1)
  const SPACE_BETWEEN_DOTS = 40
  const BASIC_SPEED_DRAWING_PARABOLE = 2
  const SPEED_DRAWING_PARABOLE_INCREASE_WITH_LEVEL = 0.2
  const BONUS_PARABOLE_HEIGHT = 120
  const HIDE_TRAJECTORY_LINE_ON_MOUSE_UP = true
  const FLAG_TICK_SPEED = 3
  const CANVAS_WIDTH = window.innerWidth
  const CANVAS_HEIGHT = window.innerHeight
  const GROUND_Y = CANVAS_HEIGHT * 0.8
  const HOLE_SCALE = 0.7 * (isMobileDevice ? 0.7 : 1)
  const FRAMERATE = 60
  //
  const gameOverScore = document.querySelector('.game-over__window__score')
  const loseWindow = document.querySelector('.game-over')
  const playAgainButton = document.querySelector('.game-over__window__button')
  const scoreDiv = document.querySelector('.score')

  const stage = new createjs.Stage('canvas')
  stage.canvas.width = CANVAS_WIDTH
  stage.canvas.height = CANVAS_HEIGHT

  const loader = new createjs.LoadQueue(false)
  manifest = [
    { src: 'object_dot.png', id: 'dot' },
    { src: 'object_flag_anim01.png', id: 'flag1' },
    { src: 'object_flag_anim02.png', id: 'flag2' },
    { src: 'object_flag_stick.png', id: 'stick' },
    { src: 'object_hole.png', id: 'hole' },
    { src: 'object_ball.png', id: 'ball' },
    { src: 'tile_ground01.png', id: 'ground' },
    { src: 'tile_ground_down_01.png', id: 'groundDown' },
    { src: 'background.png', id: 'background' }
  ]
  loader.loadManifest(manifest, true, './img/')
  loader.addEventListener('complete', () => handleComplete())

  const handleComplete = () => {
    let level = localStorage.getItem('level') || 0
    scoreDiv.innerText = level
    let allowFly = false
    let allowDraw = false
    let gameBlock = false

    let power = 20
    const powerIncrease = () => {
      power += BASIC_SPEED_DRAWING_PARABOLE + level * (SPEED_DRAWING_PARABOLE_INCREASE_WITH_LEVEL)
    }

    const getYPosition = (power, x) => {
      const height = (power + BONUS_PARABOLE_HEIGHT) / 2
      // a(x-x1)(x-x2)
      return -1 * (height / (power * power * -1)) * (x - BALL_START_POSITION_X) * (x - BALL_START_POSITION_X - (2 * power))
    }

    const groundImg = loader.getResult('ground')
    const ground = new createjs.Shape()
    ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, CANVAS_WIDTH, groundImg.height)
    ground.y = GROUND_Y

    const groundDownImg = loader.getResult('groundDown')
    const groundDown = new createjs.Shape()
    groundDown.graphics.beginBitmapFill(groundDownImg).drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y)
    groundDown.y = GROUND_Y

    const holeImg = loader.getResult('hole')
    const stickImg = loader.getResult('stick')
    const flag1Img = loader.getResult('flag1')
    const flag2Img = loader.getResult('flag2')
    const holeContainer = new createjs.Container()
    holeContainer.scaleX = HOLE_SCALE
    holeContainer.scaleY = HOLE_SCALE
    holeContainer.x = (Math.random() * 5 + 4) / 10 * CANVAS_WIDTH
    holeContainer.y = GROUND_Y
    holeContainer.width = holeImg.width * HOLE_SCALE
    holeContainer.height = holeImg.height * HOLE_SCALE
    holeContainer.setRandomPosition = () => {
      createjs.Tween
        .get(holeContainer)
        .to({ x: (Math.random() * 5 + 4) / 10 * CANVAS_WIDTH }, 500, createjs.Ease.circOut)
    }

    const hole = new createjs.Shape()
    hole.graphics.beginBitmapFill(holeImg, 'no-repeat').drawRect(0, 0, holeImg.width, holeImg.height)

    const stick = new createjs.Shape()
    stick.graphics.beginBitmapFill(stickImg, 'no-repeat').drawRect(0, 0, stickImg.width, stickImg.height)
    stick.y = 0 - stickImg.height
    stick.x = holeImg.width / 2 - stickImg.width / 2

    const flag = new createjs.SpriteSheet({
      images: [flag1Img, flag2Img],
      frames: [
        [0, 0, flag1Img.width, flag1Img.height, 0, 0, 0],
        [0, 0, flag2Img.width, flag2Img.height, 1, 0, 0]
      ],
      animations: {
        idle: [0, 1],
      },
      framerate: FLAG_TICK_SPEED
    })

    const animationFlag = new createjs.Sprite(flag, 'idle')
    animationFlag.x = stick.x + stickImg.width
    animationFlag.y = stick.y

    holeContainer.addChild(hole, stick, animationFlag)

    const ballImg = loader.getResult('ball')
    const ball = new createjs.Shape()
    ball.scaleX = BALL_RADIUS / (ballImg.width / 2)
    ball.scaleY = BALL_RADIUS / (ballImg.width / 2)
    ball.graphics.beginBitmapFill(ballImg).drawCircle(ballImg.width / 2, ballImg.width / 2, ballImg.width / 2)
    ball.setStartPosition = function () {
      this.x = BALL_START_POSITION_X
      this.y = GROUND_Y - (BALL_RADIUS * 2) + 4
    }
    ball.setStartPosition()
    ball.startFly = () => {
      allowDraw = false
      allowFly = true
      trajectory.hideDots(HIDE_TRAJECTORY_LINE_ON_MOUSE_UP)
    }
    ball.stopFly = function () {
      allowFly = false
      this.y = GROUND_Y - BALL_RADIUS * 2 + 4
    }
    ball.fly = function () {
      this.y = getYPosition(power, (this.x + BALL_RADIUS)) + (GROUND_Y - BALL_RADIUS * 2)
      this.x += BALL_VELOCITY
    }
    ball.isInHole = () => (
      BALL_START_POSITION_X + BALL_RADIUS + 2 * power - 5 >= holeContainer.x &&
      BALL_START_POSITION_X + BALL_RADIUS + 2 * power + 5 <= holeContainer.x + holeContainer.width
    )
    ball.isOnGround = () => ball.y + BALL_RADIUS * 2 > GROUND_Y
    ball.goToHole = () => {
      createjs.Tween
        .get(ball)
        .to({ x: (holeContainer.x + holeContainer.width / 2 - BALL_RADIUS), y: GROUND_Y + holeContainer.height * 0.75 - 2 * BALL_RADIUS }, 100, createjs.Ease.circOut)
    }

    const dotImg = loader.getResult('dot')
    const trajectory = new createjs.Container()
    trajectory.y = GROUND_Y
    trajectory.dots = []
    trajectory.hideDots = function (shouldHide) {
      if (shouldHide) {
        this.dots.forEach(dot => dot.visible = false)
      }
    }
    trajectory.addDot = function () {
      const dot = new createjs.Shape()
      dot.scaleX = DOT_RADIUS / (dotImg.width / 2)
      dot.scaleY = DOT_RADIUS / (dotImg.width / 2)
      dot.graphics.beginBitmapFill(dotImg).drawCircle(dotImg.width / 2, dotImg.width / 2, dotImg.width / 2)
      this.dots.push(dot)
      this.addChild(dot)
    }
    trajectory.setDotPosition = function (index) {
      if (!this.dots[index]) {
        this.addDot()
      }
      const x = BALL_START_POSITION_X + 2 * BALL_RADIUS + (index * SPACE_BETWEEN_DOTS)
      this.dots[index].x = x
      this.dots[index].y = getYPosition(power, x) - BALL_RADIUS - DOT_RADIUS
      this.dots[index].visible = true
    }
    trajectory.isMaxPower = () => power * 2 + BALL_START_POSITION_X + BALL_RADIUS >= CANVAS_WIDTH
    trajectory.startDrawing = function () {
      allowDraw = true
      power = 20
      this.hideDots(!HIDE_TRAJECTORY_LINE_ON_MOUSE_UP)
    }

    stage.addChild(trajectory, groundDown, ground, holeContainer, ball)

    const nextLevel = () => {
      ball.goToHole()
      setTimeout(() => {
        power = 20
        localStorage.setItem('level', ++level)
        scoreDiv.innerText = level
        holeContainer.setRandomPosition()
        ball.setStartPosition()
      }, 1000)
    }

    const loseGame = () => {
      localStorage.setItem('level', 0)
      gameBlock = true
      gameOverScore.innerText = level
      loseWindow.style.display = 'flex'
    }

    const restartGame = () => {
      level = 0
      scoreDiv.innerText = level
      ball.setStartPosition()
      loseWindow.style.display = 'none'
      gameBlock = false
    }

    stage.canvas.addEventListener(isMobileDevice ? 'touchstart' : 'mousedown', (evt) => {
      if ((isMobileDevice || evt.buttons === 1) && ball.x === BALL_START_POSITION_X) {
        trajectory.startDrawing()
      }
    })

    stage.canvas.addEventListener(isMobileDevice ? 'touchend' : 'mouseup', () => {
      if (!gameBlock) {
        if (allowDraw) {
          ball.startFly()
        }
      }
    })

    playAgainButton.addEventListener('click', restartGame)

    createjs.Ticker.framerate = FRAMERATE
    createjs.Ticker.addEventListener('tick', evt => {
      if (!gameBlock) {
        if (allowDraw) {
          powerIncrease()
          for (let i = 0; i * SPACE_BETWEEN_DOTS < 2 * power + SPACE_BETWEEN_DOTS; i++) {
            trajectory.setDotPosition(i)
          }
          if (trajectory.isMaxPower()) {
            ball.startFly()
          }
        }

        if (allowFly) {
          ball.fly()
          if (ball.isOnGround()) {
            ball.stopFly()
            if (ball.isInHole()) {
              nextLevel()
            } else {
              loseGame()
            }
          }
        }
      }
      stage.update(evt)
    })
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth !== CANVAS_WIDTH || window.innerHeight !== CANVAS_HEIGHT) {
      location.reload(false)
    }
  })
})()