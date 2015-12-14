/**
 * Graphics Dynamic Interface
 *
 * @version 0.0.1
 * @author Werd
 */
An.Extension(function(root){

    //
    root.shape = function(){
        console.log('root shape');
    };

    root.context.shape = function(){
        console.log('context shape');
    };

});

