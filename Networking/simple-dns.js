const dns = require("dns/promises");

(async () => {
    const result = await dns.lookup(
        "ec2-15-207-202-162.ap-south-1.compute.amazonaws.com"
    );
    console.log(result);
})();
