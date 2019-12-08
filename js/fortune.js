var fortunes = ["fortune1","fortune2","etc"];
exports.tell = function () {return fortunes[Math.floor(Math.random() * fortunes.length)];}

