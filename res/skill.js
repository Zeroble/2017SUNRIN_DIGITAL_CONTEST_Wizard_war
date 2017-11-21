let throwSkills = {}
let ballImg = new Image()
ballImg.src = './res/energyball.png'
function slow(per) {
    socket.emit("slow", {
        per: per
    })
}
function damage(dam) {
    socket.emit("attack", {
        damage: dam
    })
}
function dotDamage(dam, sec, times) {
    for (let i = 1; i <= times;i++){
        setTimeout(damage(dam), i*sec);
    }
}

class skill {
    constructor(effect,effectImg,imgWdith,imgHeight) {
        this.effect = effect
        this.isLive = true
    }
    effect() {

    }
    render(){
        
    }
}
class throwSkill extends skill {
    constructor(x, y, angle, mX, mY, effect,effectImg,imgWdith,imgHeight) {
        super(effect,effectImg,imgWdith,imgHeight)
        this.x = x
        this.y = y
        this.tmpX = x
        this.tmpY = y
        this.angle = angle
        this.mX = mX
        this.mY = mY
        this.isThrowSkill = true
    }
    move() {

    }
}
class energyBall extends throwSkill {
    constructor(x, y, angle, mX, mY,speed) {
        super(x, y, angle, mX*speed, mY*speed, function () {
            damage(100)
        },ballImg,17,17)
    }
}