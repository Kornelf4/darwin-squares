function checkAABBCollision(obj1, obj2) {
    return obj1.x < obj2.x + 1 &&
           obj1.x + 1 > obj2.x &&
           obj1.y < obj2.y + 1 &&
           obj1.y + 1 > obj2.y;
}