class BloodItem extends DurationEntity {

    constructor(x,y) {
        super(x,y,0,0,0,0,16,false,600);
        this.color = "#FF0000";
        this.value = 3;
    }

    update() {
        super.update();
    }



}