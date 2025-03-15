import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("collections", "./routes/collections.tsx"),
  route("upcoming", "./routes/upcoming.tsx"),
  route("about", "./routes/about.tsx"),
  route("anime/:animeId", "./routes/anime/$animeId.tsx"),
  route("shush", "./routes/secret.tsx"),
  route("studio/:studioname", "./routes/studio/$studioname.tsx"),
  route("genre/:genrename", "./routes/genre/$genrename.tsx"),
  route("voiceactor/:charid", "./routes/voiceactor/$charid.tsx"),
  route("character/:charid", "./routes/character/$charid.tsx"),
  route("people/:id", "./routes/people/$id.tsx"),
  route("user/:name", "./routes/user/$name.tsx"),
  route("getstarted", "./routes/weeb.tsx"),
  route("morecharacters/:animeid", "./routes/morecharacters/$animeid.tsx"),
  route("top-rated", "./routes/top-rated.tsx"),
  route("trending", "./routes/airing.tsx"),
  route("search/:query", "./routes/search/$query.tsx"),
  route("top_characters", "./routes/characters.tsx"),
  route("topbyyear", "./routes/yearstop.tsx"),
] satisfies RouteConfig;
