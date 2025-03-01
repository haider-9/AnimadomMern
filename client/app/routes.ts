import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("collections", "./routes/collections.tsx"),
  route("upcoming", "./routes/upcoming.tsx"),
  route("about", "./routes/about.tsx"),
  route("anime/:animeId", "./routes/anime/$animeId.tsx"),
  route("studio/:studioname", "./routes/studio/$studioname.tsx"),
  route("genre/:genrename", "./routes/genre/$genrename.tsx"),
  route("voiceactor/:charid", "./routes/voiceactor/$charid.tsx"),
  route('character/:charid', './routes/character/$charid.tsx'),
  route('people/:id', './routes/people/$id.tsx'),
] satisfies RouteConfig;
