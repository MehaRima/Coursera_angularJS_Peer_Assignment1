(function() {
	'use strict';

	angular.module("NarrowItDownApp", [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)
    .constant ('ApiBasePath', "https://davids-restaurant.herokuapp.com");


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService ( $http, ApiBasePath) {
        var service = this; 
        service.getMatchedMenuItems = function (searchTerm) {
            var foundItems=[];
            return $http ({
                method: "GET",
                url: (ApiBasePath +"/menu_items.json")
            }).then (function success(response){
    
                    for (var i = 0; i < response.data['menu_items'].length; i++) {
                        if (( response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
                            ( response.data['menu_items'][i]['name'].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
                            ( response.data['menu_items'][i]['short_name'].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)){
                            foundItems.push(response.data['menu_items'][i]);
                        }
                    }
                    return foundItems;
            }, function error (response){
                console.log("Error retriving data from API");
                return foundItems;
            });
        };  
    }


    function FoundItemsDirective () {
        return {
            templateUrl: 'foundItem.html',
            restrict: 'E',
            scope: {
                foundItems: '=myList' 
            }
        } 
    }


    NarrowItDownController.$inject =['MenuSearchService'];
    function NarrowItDownController (MenuSearchService) {

        var searchCntrl = this;
        searchCntrl.searchTerm = '';
        searchCntrl.message = '';
        searchCntrl.found = [];

        searchCntrl.findMenuItems = function () {
            
            if (searchCntrl.searchTerm.trim().length > 0){
                
                MenuSearchService.getMatchedMenuItems(searchCntrl.searchTerm)
                .then(function (foundItems) {
                    if (foundItems.length){
                        searchCntrl.found = foundItems;
                        searchCntrl.message =  '';
                    } else {
                        searchCntrl.found = [];
                        searchCntrl.message =  'Nothing found!';  
                    }
                    
    			});
            } else {
               // show 'Nothing found' error if search string is empty
               searchCntrl.found = [];
               searchCntrl.message =  'Nothing found!';
            }
        }

        searchCntrl.removeMenuItem = function(itemIndex) {
            searchCntrl.found.splice(itemIndex, 1);
        }
    }
})();