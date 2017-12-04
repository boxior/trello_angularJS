module.exports = {
    init: init
};

function init() {
    var app = angular.module("app", []);

    //Controllers

    app.controller("listsCtrl", function (listFactory) {
        this.lists = listFactory.getLists();
        this.addList = function () {
            // console.log('this.listName', this.listName);
            listFactory.addList(this.listName);
            this.listName = "";
        }
    });

    app.controller("listCtrl", function (listFactory, cardFactory) {
        this.removeList = function (list) {
            listFactory.removeList(list);
        };

        this.getCards = function (list) {
            return cardFactory.getCards(list);
        }

        this.createCard = function (list) {
            cardFactory.createCard(list, this.cardDescription);
            this.cardDescription = '';
        }
    });

    app.controller("cardCtrl", function (cardFactory) {
        this.isEditing = false;
        this.editingCard = null;

        this.deleteCard = function (card) {
            cardFactory.deleteCard(card);
        }

        this.editCard = function (card) {
            this.isEditing = true;
            this.editingCard = angular.copy(card);
        }

        this.updateCard = function () {
            cardFactory.updateCard(this.editingCard);
            this.isEditing = false;
            this.editingCard = null;

        }
    });

    //Factories

    app.factory("listFactory", function () {
        var service = {};

        var lists = [
            {
                id: 1,
                listName: "To Do"
            },
            {
                id: 2,
                listName: "In Progress"
            },
            {
                id: 3,
                listName: "Done"
            }
        ];

        service.getLists = function () {
            return lists;
        }

        service.addList = function (listName) {
            lists.push({
                id: _.uniqueId('list_'),
                listName: listName
            });
        };

        service.removeList = function (list) {
            _.pull(lists,list);
        }

        return service;
    });

    app.factory("cardFactory", function () {
        var service = {};

        var cards = [
            {
                id: 1,
                description: "Fix some bugs",
                list_id: 1
            },
            {
                id: 2,
                description: "Add some task",
                list_id: 1
            },
            {
                id: 3,
                description: "Done some action",
                list_id: 2
            }
        ];

        service.getCards = function (list) {
            return _.filter(cards, {list_id: list.id});
        }
        service.createCard = function (list, cardDescription) {
            cards.push({
                id: _.uniqueId('card_'),
                description :cardDescription,
                list_id: list.id
            });
        }

        service.updateCard = function (updatingCard) {
            var card = _.find(cards, {id: updatingCard.id});
            card.description = updatingCard.description;
            card.list_id = updatingCard.list_id;
        }

        service.deleteCard = function (card) {
            return _.pull(cards, card);
        }
        return service;
    });

    //Directives

    app.directive("closeEditing", function () {
        var KEYS = {
            ESCAPE : 27
        }
        return {
            scope: {
                isEditing: '='
            },
            link: function (scope, element, attrs) {
                element.on('keyup', function (e) {
                    if(_.isEqual(e.keyCode, KEYS.ESCAPE)) {
                        scope.isEditing  = false;
                        scope.$apply();
                    }
                });
            }
        }
    });

}