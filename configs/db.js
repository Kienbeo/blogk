var mongoose = require("mongoose");
mongoose.set("debug", true);

// mongoose.connect('mongodb://root:root1995@ds125362.mlab.com:25362/blogk',{
// 	useNewUrlParser: true
// });
// mongoose.connect('mongodb://myUserAdmin:abc123@localhost:27017/medium',{
// 	useNewUrlParser: true
// });
// mongoose.connect('mongodb+srv://root:root95@cluster0.uh3qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
mongoose
  .connect(
    "mongodb+srv://root2:root@cluster0.tgu2z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log("Error connecting with error code:", err);
  });
