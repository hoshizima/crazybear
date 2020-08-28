class Cellgirl{
    constructor(HitPoint,x,y,img){
        this.HitPoint=HitPoint;
        this.x=x;
        this.y=y;
        this.img=img;
        this.speed=0;
    }
    get positionX(){
        return this.x;
    }
    set positionX(x){
        this.x=x;
    }
    get positionY(){
        return this.y;
    }
    set positionY(y){
        this.y=y;
    }    
    get myHitPoint(){
        return this.HitPoint;
    }
    set myHitPoint(HitPoint){
        this.HitPoint=HitPoint;
    }
    get mySpeed(){
        return this.HitPoint;
    }
    set mySpeed(speed){
        this.speed=speed;
    }
}