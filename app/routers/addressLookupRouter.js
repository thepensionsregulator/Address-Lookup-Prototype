const express = require("express");

const addressLookupRouter = express.Router();

addressLookupRouter.route('/find-an-address')
    .get((req, res) => {
        req.session.destroy();
        res.render("address-lookup/find-an-address.njk");
    })
    .post((req, res) => {
        if(req.session.data['postcode'] == '' && req.session.data['building'] == ''){
            res.render("address-lookup/find-an-address.njk", {errors : true});
        }

        const addresses = addressLookup(req.session.data['postcode'], req.session.data['building']);

        if (addresses.length == 0){
            res.redirect("not-found");
        }
        else if(addresses.length == 1){
            req.session.data['address-id'] = addresses[0].id;
            res.redirect("confirm-address");
        }
        else{
            res.redirect("select-an-address");
        }
    });
    
addressLookupRouter.route('/not-found')
    .get((req, res) => {
        res.render("address-lookup/not-found.njk", {postcode: req.session.data["postcode"], building: req.session.data["building"]});
    });
    
addressLookupRouter.route('/confirm-address')
    .get((req, res ) => {
        const viewModel = {
            noOfAddresses: undefined,
            postcode : undefined,
            address : undefined
        };
        if(req.session.data['address-line-1'] !== undefined){
            viewModel.address = `${req.session.data["address-line-1"]}, ${req.session.data["address-line-2"]}, ${req.session.data["town-or-city"]}, ${req.session.data["postcode"]}`;
            viewModel.postcode = req.session.data['postcode'];
            viewModel.noOfAddresses = 0;
        }else{
            const addresses = addressLookup(req.session.data['postcode'], req.session.data['building']);
            const address = addresses.find(x => x.id == req.session.data["address-id"]);
            viewModel.address = address.address;
            viewModel.postcode = address.postcode;
            viewModel.noOfAddresses = addresses.length;
        }
        
        res.render("address-lookup/confirm-address.njk", viewModel);
    })
    
addressLookupRouter.route('/select-an-address')
    .get((req, res) => {
        let addresses = addressLookup(req.session.data['postcode'], req.session.data['building']);
        addresses = addresses.map(address => ({value: address.id, text: address.address}));
        
        res.render("address-lookup/select-an-address.njk", {postcode: req.session.data["postcode"], building: req.session.data["building"], addresses});
    })
    .post((req, res) => {
        res.redirect("confirm-address");
    });

addressLookupRouter.route('/address-summary')
    .get((req, res) => {
        let address = '';
        if(req.session.data['address-line-1'] !== undefined){
            address = `${req.session.data["address-line-1"]}, ${req.session.data["address-line-2"]}, ${req.session.data["town-or-city"]}, ${req.session.data["postcode"]}`;
        }else{
            const addresses = addressLookup(req.session.data['postcode'], req.session.data['building']);
            address = addresses.find(x => x.id == req.session.data["address-id"]).address;
        }
        res.render("address-lookup/summary.njk", {address})
    });

addressLookupRouter.route('/manual-entry')
    .get((req, res) => {
        res.render("address-lookup/manual-entry.njk")
    })
    .post((req, res) =>{
        res.redirect("confirm-address");
    });


function addressLookup(postcode, building){
    let addresses = [{id: 1, address: "1 High Street, Brighton, East Sussex, BN1", postcode: "BN6 1AF"}, {id: 6, address: "12 High Street, Brighton, East Sussex, BN1", postcode: "BN6 1AF"}, {id: 2, address: "2 High Street, Brighton, East Sussex, BN1", postcode: "BN6 1AF"}, {id: 3, address: "3 High Street, Brighton, East Sussex, BN1", postcode: "BN6 1AF"}, {id: 4, address: "4 High Street, Brighton, East Sussex, BN1", postcode: "BN6 1AF"}];
    if(postcode === undefined && building === undefined){
        return [];
    }
    else if (postcode !== ''){
        addresses = addresses.filter(x => x.postcode == postcode.trim());
    }

    if(building !== ''){
        addresses = addresses.filter(x => x.address.substring(0, 10).includes(building.trim()))
    }

    if(addresses.length == 0){
        return [];
    }

    return addresses;
}

module.exports = addressLookupRouter;