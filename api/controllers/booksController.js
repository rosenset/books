const { default: axios } = require("axios");

exports.searchBooks = async (req, res) => {
  try {
    if (!req.query.q) {
      res.status(400).json({
        message: "Please provide a search query",
      });
    }
    let {q,page} = req.query
    let url = `https://www.googleapis.com/books/v1/volumes?q=${
      req.query.q
    }&key=${process.env.GOOGLE_API_KEY}`;

    if(page){
      let startIndex = (page * 40) - 40;
      maxResults = 40;
      url += `&startIndex=${startIndex}&maxResults=${maxResults}`;
    }

    const response = await axios.get(url);
    console.log(response)
    let results = response.data.items.map((item) => {
      let { volumeInfo } = item;
      let obj = {
        title: volumeInfo.title,
        authors: volumeInfo.authors,
        subtitle: volumeInfo.subtitle,
        description: volumeInfo.description,
        categories: volumeInfo.categories,
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        previewLink: volumeInfo.previewLink,
        coverImage: volumeInfo?.imageLinks?.thumbnail,
      };
      if (obj.description) {
        if (obj.description.length > 140) {
          obj.description = obj.description.substring(0, 140);
        }
      }
      return obj;
    });
    //send response data to frontend
    res.status(200).json({
      status: "ok",
      message: "successful",
      results,
      totalItems: response.data.totalItems,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error);
  }
};
