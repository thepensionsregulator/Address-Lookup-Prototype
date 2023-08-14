//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// TODO: Replace hardcoded addresses with our API call
const addresses = [{id: 1, address: "1 High Street, Brighton, East Sussex, BN1"}, {id: 2, address: "2 High Street, Brighton, East Sussex, BN1"}, {id: 3, address: "3 High Street, Brighton, East Sussex, BN1"}, {id: 4, address: "4 High Street, Brighton, East Sussex, BN1"}];


// Home page
router.get("/", function (req, res) {
  res.send("Wiki home page");
});

// Find an address GET and POST
router.get("/find-an-address", function (req, res) {
  res.render("find-an-address.njk");
});

router.post("/find-an-address", function (req, res){
  console.log(req.session.data);

  if(req.session.data['postcode'] == '' || req.session.data['building'] == ''){
      res.render("find-an-address.njk", {errors : { postcode: true, building: true }});
  }

  else{  
      const radioButtonItems = addresses.map(address => ({value: address.id, text: address.address}))
      res.render("select-an-address.njk", {radioButtonItems});
  }
});

// Select an address
router.get("/select-an-address", function (req, res){
  console.log("GET");
  console.log(req.session.data);
  res.render("select-an-address.njk");
});


router.post("/select-an-address", function (req, res){
  console.log("the post");
  console.log(req.session.data);

  const address = addresses.find(x => x.id == req.session.data["address-id"]).address;

  res.render("confirm-address.njk", {noOfAddresses: addresses.length, postcode: req.session.data["postcode"], building: req.session.data["building"], address: address});
});

router.get("/address-summary", (req, res) => {
  const address = addresses.find(x => x.id == req.session.data["address-id"]).address;
  res.render("address-summary.njk", {address})
});