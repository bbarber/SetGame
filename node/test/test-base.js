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

var map = function ( elems, callback, arg ) {
    var value, key,
        ret = [],
        i = 0,
        length = elems.length,
        // jquery objects are treated as arrays
        isArray =  length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0  ) ;

    // Go through the array, translating each of the items to their
    if ( isArray ) {
        for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
                ret[ ret.length ] = value;
            }
        }

    // Go through every key on the object,
    } else {
        for ( key in elems ) {
            value = callback( elems[ key ], key, arg );

            if ( value != null ) {
                ret[ ret.length ] = value;
            }
        }
    }

    // Flatten any nested arrays
    return ret.concat.apply( [], ret );
    }

module.exports.load = load;
module.exports.map = map;