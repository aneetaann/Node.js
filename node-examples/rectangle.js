module.exports = (x,y,callback) => {
    if (x <= 0 || y <= 0) {
        setTimeout(() =>
        callback(new Error("Rectangle dimensions should be greater than zero"),
        null),
        2000);
    }  //2000ms or 2sec timedelay 
    else {
        setTimeout(() => 
        callback(null, {
            perimeter: () => (2*(x+y)),
            area:() => (x*y)
        }), 
        2000);
    }
}