var load = function(files) {
    
    for(var i = 0; i < files.length; i++) {
        var path = '../public/js/' + files[i];        

        // Clear the module cache if it exists
        if(require.resolve(path)) {
            require.cache[require.resolve(path)] = null;
        }

        require(path);
    }    

    // only loads once, node will cache
    ko = require('knockout')
};


module.exports.load = load;