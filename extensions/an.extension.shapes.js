An.Extension(function(root){

    //
    root.shape = function(){
        console.log('root shape');
    };

    root.context.shape = function(){
        console.log('context shape');
    };

});

