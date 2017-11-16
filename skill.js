function slow(per) {
    socket.emit("slow",{
        per:per
    })
}
function damage(dam) {
    socket.emit("attack",{
        damage : dam
    })
}

class skill{
    constructor(effect){
        this.hit = effect        
    }
    hit(){

    }
}
class throwSkill extends skill{
    constructor(x,y,angle,mX,mY,effect){
        super(effect)
    }
    move(){

    }
}
class buffSkill{

}
