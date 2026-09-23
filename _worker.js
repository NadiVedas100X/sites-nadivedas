const ORIGIN = "https://sites-nadivedas-git.delete-safely-cloud.workers.dev";

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const upstream = new URL(incoming.pathname + incoming.search, ORIGIN);
    const response = await fetch(new Request(upstream, request));
    return new Response(response.body, response);
  },
};
