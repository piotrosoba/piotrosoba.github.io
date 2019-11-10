//CONFIG
const BALL_START_POSITION_X = 50
const BALL_RADIUS = 20
const DOT_RADIUS = 11
const VELOCITY = 10
const BONUS_PARABOLE_HEIGHT = 120
const SPACE_BETWEEN_DOTS = 40
const FLAG_TICK_SPEED = 3
const SPEED_DRAWING_PARABOLE_INCREASE_WITH_LEVEL = 2
const CANVAS_WIDTH = window.innerWidth
const CANVAS_HEIGHT = window.innerHeight
const GROUND_Y = CANVAS_HEIGHT * 0.8
const HOLE_SCALE = 0.7
//
const gameOverScore = document.querySelector('.game-over__window__score')
const loseWindow = document.querySelector('.game-over')
const playAgainButton = document.querySelector('.game-over__window__button')
const scoreDiv = document.querySelector('.score')

let ball
let power = 20
let level = 0
let allowFly = false
let allowDraw = false
let gameBlock = false

const init = () => {
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
  loader.addEventListener('complete', () => handleComplete(stage, loader))
}

const handleComplete = (stage, loader) => {
  const groundImg = loader.getResult('ground')
  const ground = new createjs.Shape()
  ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, CANVAS_WIDTH, groundImg.height)
  ground.y = GROUND_Y

  const groundDownImg = loader.getResult('groundDown')
  const groundDown = new createjs.Shape()
  groundDown.graphics.beginBitmapFill(groundDownImg).drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y)
  groundDown.y = GROUND_Y

  const ballImg = loader.getResult('ball')
  ball = new createjs.Shape()
  ball.scaleX = BALL_RADIUS / (ballImg.width / 2)
  ball.scaleY = BALL_RADIUS / (ballImg.width / 2)
  ball.graphics.beginBitmapFill(ballImg).drawCircle(ballImg.width / 2, ballImg.width / 2, ballImg.width / 2)
  ball.x = BALL_START_POSITION_X
  ball.y = GROUND_Y - (BALL_RADIUS * 2) + 4

  const holeImg = loader.getResult('hole')
  const stickImg = loader.getResult('stick')
  const flag1Img = loader.getResult('flag1')
  const flag2Img = loader.getResult('flag2')

  const holeContainer = new createjs.Container()
  holeContainer.scaleX = HOLE_SCALE
  holeContainer.scaleY = HOLE_SCALE
  holeContainer.x = (Math.random() * 5 + 5) / 10 * CANVAS_WIDTH - holeImg.width
  holeContainer.y = GROUND_Y

  const hole = new createjs.Shape()
  hole.graphics.beginBitmapFill(holeImg, 'no-repeat').drawRect(0, 0, holeImg.width, holeImg.height)

  const stick = new createjs.Shape()
  stick.graphics.beginBitmapFill(stickImg).drawRect(0, 0, stickImg.width, stickImg.height)
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

  const dotImg = loader.getResult('dot')
  const trajectory = new createjs.Container()
  trajectory.y = GROUND_Y
  trajectory.dots = []

  stage.addChild(trajectory, groundDown, ground, holeContainer, ball)

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener('tick', evt => {
    if (!gameBlock) {

      if (allowDraw) {
        for (let i = 0; i * SPACE_BETWEEN_DOTS < 2 * power + SPACE_BETWEEN_DOTS; i++) {
          if (!trajectory.dots[i]) {
            const dot = makeDot(dotImg)
            trajectory.dots.push(dot)
            trajectory.addChild(dot)
          }
          trajectory.dots[i].visible = true
          const x = BALL_START_POSITION_X + i * SPACE_BETWEEN_DOTS
          trajectory.dots[i].x = x
          trajectory.dots[i].y = getYPosition(power, x) - BALL_RADIUS - DOT_RADIUS
        }
        power += 2 + level * (SPEED_DRAWING_PARABOLE_INCREASE_WITH_LEVEL / 10)

        if (power * 2 + BALL_START_POSITION_X + BALL_RADIUS >= CANVAS_WIDTH) {
          allowDraw = false
          allowFly = true
          trajectory.dots.forEach(dot => dot.visible = false)
        }

      }

      if (allowFly) {
        ball.y = getYPosition(power, (ball.x + BALL_RADIUS)) + (GROUND_Y - BALL_RADIUS * 2)
        ball.x += VELOCITY

        if (ball.y + BALL_RADIUS * 2 > GROUND_Y) {
          const holeWidth = holeImg.width * HOLE_SCALE
          const holeHeight = holeImg.height * HOLE_SCALE
          allowFly = false
          ball.y = GROUND_Y - BALL_RADIUS * 2 + 4

          if (
            BALL_START_POSITION_X + BALL_RADIUS + 2 * power - 5 >= holeContainer.x &&
            BALL_START_POSITION_X + BALL_RADIUS + 2 * power + 5 <= holeContainer.x + holeWidth
          ) {
            nextLevel(holeContainer, holeWidth, holeHeight)
          } else {
            loseGame()
          }
        }
      }
    }
    stage.update(evt)
  })

  stage.canvas.addEventListener('mousedown', (evt) => {
    if (evt.buttons === 1 && !allowFly && !gameBlock && ball.x === BALL_START_POSITION_X) {
      allowDraw = true
      power = 20
    }
  })

  stage.canvas.addEventListener('mouseup', () => {
    if (!gameBlock) {
      if (allowDraw) {
        allowDraw = false
        allowFly = true
        trajectory.dots.forEach(dot => dot.visible = false)
      }
    }
  })
}

const getYPosition = (power, x) => {
  const height = (power + BONUS_PARABOLE_HEIGHT) / 2
  return -1 * (height / (power * power * -1)) * (x - BALL_START_POSITION_X) * (x - BALL_START_POSITION_X - (2 * power)) // a(x-x1)(x-x2)
}

const nextLevel = (holeContainer, holeWidth, holeHeight) => {
  createjs.Tween.get(ball).to({ x: (holeContainer.x + holeWidth / 2 - BALL_RADIUS), y: GROUND_Y + holeHeight * 0.75 - 2 * BALL_RADIUS }, 100, createjs.Ease.circOut)
  setTimeout(() => {
    power = 20
    level++
    scoreDiv.innerText = level
    createjs.Tween.get(holeContainer).to({ x: (Math.random() * 5 + 4) / 10 * CANVAS_WIDTH }, 500, createjs.Ease.circOut)
    ball.x = BALL_START_POSITION_X
    ball.y = GROUND_Y - BALL_RADIUS * 2 + 4
  }, 1000)
}

const loseGame = () => {
  gameBlock = true
  gameOverScore.innerText = level
  loseWindow.style.display = 'flex'
}

playAgainButton.addEventListener('click', () => {
  level = 0
  scoreDiv.innerText = level
  allowFly = false
  ball.y = GROUND_Y - BALL_RADIUS * 2 + 4
  ball.x = BALL_START_POSITION_X
  loseWindow.style.display = 'none'
  gameBlock = false
})

const makeDot = (dotImg) => {
  const dot = new createjs.Shape()
  dot.scaleX = DOT_RADIUS / (dotImg.width / 2)
  dot.scaleY = DOT_RADIUS / (dotImg.width / 2)
  dot.graphics.beginBitmapFill(dotImg).drawCircle(dotImg.width / 2, dotImg.width / 2, dotImg.width / 2)
  return dot
}
