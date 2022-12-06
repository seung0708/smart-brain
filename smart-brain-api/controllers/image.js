const {ClarifaiStub, grpc} = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization")


const handleImage = (req, res) => {
    const {id} = req.body;
    db('users').where('id','=', id) 
        .increment('entries',1)
        .returning('entries')
        .then(entries => {
            console.log(entries[0].entries)
        })
        .catch(err => res.status(400).json('Unable to get entries'))
    // let found = false;
    // if(!found) {
    //     res.status(400).json('Not found')
    // }
}

module.exports = {
    handleImage
}