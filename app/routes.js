//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit');
const addressLookupRouter = require('./routers/addressLookupRouter');
const router = govukPrototypeKit.requests.setupRouter()


// Home page
router.get("/", function (req, res) {
  res.send("Wiki home page");
});


router.use("/address-lookup", addressLookupRouter);
