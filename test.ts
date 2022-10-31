import youtubeSearch from "youtube-search";

const opts: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 10,
  key: "AIzaSyD0XXjkbMYKeeRtXM4HC7W2qxtJgE30xHk",
  part: 'contentDetails'
};

youtubeSearch("renai circulation", opts, (err, results) => {
  if(err ||results === undefined ) return console.log(err);

  console.dir(results[0]);
})
