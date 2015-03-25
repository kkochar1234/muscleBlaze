var catalogService = require('../services/catalogService')

exports.getCatalogData = function(req,res){

  function cb(err, data) {
    return res.cfaRender('catalog/catalog',err, {catalogData : data},req,res)
  }

  catalogService.getCatalogData(req, cb)

}

exports.getCatalogLoadMoreData = function(req,res){

  function cb(err, variants) {
    return res.cfaRender('catalog/catalogPagination',err, {variants : variants},req,res)
  }

  catalogService.getCatalogLoadMoreData(req, cb)

}

exports.getProductData = function(req,res){

  function cb(err, productData) {
    var view = "catalog/product"
    if(!err){
      if(productData.results.exception == true){
        view = "404";
        err = {statusCode:404}
      }
    }

      return res.cfaRender(view,err, productData,req,res)
  }

  catalogService.getProductData(req, cb)

}



