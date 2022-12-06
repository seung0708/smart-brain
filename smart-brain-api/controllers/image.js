const {ClarifaiStub, grpc} = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key f6191614198a4cfb83707b35a3751091");


// const Clarifai = require('clarifai')
// console.log(Clarifai)

// const app = new Clarifai.App({
//     apiKey: 'f6191614198a4cfb83707b35a3751091'
// })
const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{data: {image: {url: "https://samples.clarifai.com/dog2.jpeg"}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response)
        }
    );
}
// const handleApiCall = (req, res) => {
//     app.models
//     .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
//     .then(data => {
//         res.json(data)
//     })
//     .catch(err => res.status(400).json('Unable to connect to API'))
// }

const handleImage = (req, res, db) => {
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
    handleImage,
    handleApiCall
}