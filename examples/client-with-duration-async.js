const { requestWithDuration } = require("../dist/index");

(async () => {
  try {
    const resp = await requestWithDuration({
      url: "https://api.github.com/users",
      headers: {
        "User-Agent": "Example"
      },
      timeout: 500
    });

    console.log(resp.duration);
  } catch (err) {
    console.error(err);
  }
})();
