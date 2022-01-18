module.exports = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async headers() {
    return [{ 
      source: "*",
      headers:[
        {
          key:'Access-Control-Allow-Origin',
          value:'*'
        }
      ] 
    }];
  },
};
