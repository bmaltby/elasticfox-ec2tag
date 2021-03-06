var ec2ui_ENITreeView = {
    COLNAMES : [
        'eni.networkInterfaceId',
        'eni.subnetId',
        'eni.vpcId',
        'eni.availabilityZone',
        'eni.description',
        'eni.ownerId',
        'eni.requesterManaged',
        'eni.status',
        'eni.macAddress',
        'eni.privateIpAddress',
        'eni.sourceDestCheck',
    ],

    treeBox : null,
    selection : null,
    networkInterfaceList : new Array(),
    registered : false,

    get rowCount() { return this.networkInterfaceList.length; },

    setTree: function(treeBox) { this.treeBox = treeBox; },

    getCellText : function(idx, column) {
        if (idx >= this.rowCount) { return ""; }
        var member = column.id.split(".").pop();
        return this.networkInterfaceList[idx][member];
    },

    isEditable: function(idx, column)  { return true; },
    isContainer: function(idx) { return false;},
    isSeparator: function(idx) { return false; },
    isSorted: function() { return false; },

    getImageSrc: function(idx, column) { return ""; },
    getProgressMode : function(idx, column) {},
    getCellValue: function(idx, column) {},

    cycleHeader: function(col) {
        cycleHeader(
          col,
          document,
          this.COLNAMES,
          this.networkInterfaceList);

        this.treeBox.invalidate();
    },

    sort: function() {
        sortView(document, this.COLNAMES, this.networkInterfaceList);
    },

    cycleCell: function(idx, column) {},
    performAction: function(action) {},
    performActionOnCell: function(action, index, column) {},
    getRowProperties: function(idx, column, prop) {},
    getCellProperties: function(idx, column, prop) {},
    getColumnProperties: function(column, element, prop) {},
    getLevel: function(idx) { return 0; },

    getSelectedNetworkInterface : function() {
        var index =  this.selection.currentIndex;
        if (index == -1) { return null; }
        return this.networkInterfaceList[index];
    },

    register: function() {
        if (!this.registered) {
            this.registered = true;
            ec2ui_model.registerInterest(this, 'networkInterfaces');
        }
    },

    invalidate: function() {
        var treeView = ec2ui_ENITreeView;
        treeView.displayNetworkInterfaces(treeView.filterNetworkInterfaces(ec2ui_session.model.networkInterfaces));
    },

    refresh: function() {
        ec2ui_session.controller.describeNetworkInterfaces();
    },

    notifyModelChanged: function(interest) {
        this.invalidate();
    },

    searchChanged: function(event) {
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(this.invalidate, 500);
    },

    filterNetworkInterfaces: function(networkInterfaces) {
        var searchText = this.getSearchText();

        if (!searchText) {
            return networkInterfaces;
        }

        var newList = new Array();
        var patt = new RegExp(searchText, "i");

        for(var i = 0; i < networkInterfaces.length; i++) {
            var event = networkInterfaces[i]

            if (this.networkInterfaceMatchesSearch(event, patt)) {
                newList.push(event);
            }
        }

        return newList;
    },

    getSearchText: function() {
        return document.getElementById('ec2ui.eni.search').value;
    },

    networkInterfaceMatchesSearch: function(event, patt) {
        if (!event || !patt) { return false; }

        for (var i = 0; i < this.COLNAMES.length; i++) {
            var member = this.COLNAMES[i].split(".").pop();
            var text = event[member];

            if (text.match(patt)) {
                return true;
            }
        }

        return false;
    },

    copyToClipBoard: function(fieldName) {
        var networkInterface = this.getSelectedNetworkInterface();
        if (networkInterface == null) { return; }
        copyToClipboard(networkInterface[fieldName]);
    },

    displayNetworkInterfaces: function (networkInterfaceList) {
        if (!networkInterfaceList) { networkInterfaceList = []; }

        this.treeBox.rowCountChanged(0, -this.networkInterfaceList.length);
        this.networkInterfaceList = networkInterfaceList;
        this.treeBox.rowCountChanged(0, this.networkInterfaceList.length);
        this.sort();
        this.selection.clearSelection();
    }
};

ec2ui_ENITreeView.register();
