/**
 * An script extension
 */
An.Extension(function(self) {

    /**
     * @type An self
     * @type CanvasRenderingContext2D self.context
     */

    if (!(this instanceof An) || !(self instanceof An))
        return;

    var ext = {
        name: '__You_Extension__'
    };

    ext.m = function(){};

    self[ext.name] = ext;
});