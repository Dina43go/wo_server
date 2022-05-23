const path = require('path');
exports.error404 = (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,"..", "public","view","404.html"));
    }else if(req.accepts('json')){
        res.json({error: '404 not found'});
    } else {
        res.type('text').send('404 not found');
    }
}