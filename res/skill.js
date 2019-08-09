let throwSkills = {}
let skillTypes = {
    "THROW":"THROW_SKILL",
    "IMMEDIATELY":"IMMEDIATELY_SKILL"
}
let ballImg = new Image()
ballImg.src = './res/fireball.png'
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
    constructor(effect,coolTime,skillType) {
        this.effect = effect
        this.coolTime = coolTime
        this.skillType = skillType;
    }
    effect() {

    }
}
class throwSkill extends skill {
    constructor(x, y, mX, mY,Imgsrc,imgWdith,imgHeight,coolTime, effect) {
        super(effect,coolTime,skillTypes.THROW)
        this.x = x
        this.y = y-imgWdith//현재 좌표
        this.tmpX = this.x
        this.tmpY = this.y//임시 좌표
        this.mX = mX
        this.mY = mY//이동할 거리
        this.img = new Image()
        this.img.src = Imgsrc;
        this.imgHeight = imgHeight;
        this.imgWdith = imgWdith;
        this.angle;
        this.SPEED = 10
    }
    render(){
        context.drawImage(this.img, this.x, this.y)
    }
    move(){
        this.tmpX += (this.mX*this.SPEED);
        this.tmpY += (this.mY*this.SPEED);
    }
}

class fireball extends throwSkill{
    constructor(x,y,mx,my){
        if(mx>=0)
            super(x,y,mx,my,"res/fireball_right.png",40,15,1000,damage(1000));
        else
            super(x,y,mx,my,"res/fireball_left.png",40,15,1000,damage(1000));
    }
}
