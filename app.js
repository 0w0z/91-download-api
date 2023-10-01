import express from 'express';
import bodyParser from 'body-parser';



const app = express();
app.use(bodyParser.json());


app.all('*', (req, res, next) => {
    next();
})



app.listen(process.env.PORT || 3005, () => {
    console.log('App is listening...');
})