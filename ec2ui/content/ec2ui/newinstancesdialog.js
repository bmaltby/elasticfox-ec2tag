var ec2_InstanceLauncher = {
    image : null,
    ec2ui_session : null,
    retVal : null,
    unusedSecGroupsList : null,
    usedSecGroupsList : null,
    vpcMenu : null,
    subnetMenu : null,
    unused : new Array(),
    used : new Array(),

    launch : function() {
        if (!this.validateMin()) return false;
        if (!this.validateMax()) return false;

        this.retVal.imageId = this.image.id;
        this.retVal.kernelId = document.getElementById("ec2ui.newinstances.aki").value;
        this.retVal.ramdiskId = document.getElementById("ec2ui.newinstances.ari").value;
        this.retVal.instanceType = document.getElementById("ec2ui.newinstances.instancetypelist").selectedItem.value;
        this.retVal.minCount = document.getElementById("ec2ui.newinstances.min").value.trim();
        this.retVal.maxCount = document.getElementById("ec2ui.newinstances.max").value.trim();
        this.retVal.tag = document.getElementById("ec2ui.newinstances.tag").value.trim();
        this.retVal.securityGroups = this.used;

        var useVpc = document.getElementById("ec2ui.newinstances.usevpc").checked;
        if (useVpc) {
            var vpcId = document.getElementById("ec2ui.newinstances.vpcId").selectedItem;
            if (!vpcId) {
                alert("No vpc selected. Please select a vpc to continue.");
                return false;
            }
            var subnet = document.getElementById("ec2ui.newinstances.subnetId").selectedItem;
            if (!subnet) {
                alert("No subnet selected. Please select a subnet to continue.");
                return false;
            }
            this.retVal.subnetId = subnet.value;

            var securityGroups = this.ec2ui_session.model.getSecurityGroups();
            var securityGroupsMap = {};

            for (var i in securityGroups) {
                if (securityGroups[i].vpcId != vpcId.value) { continue; }
                securityGroupsMap[securityGroups[i].name] = securityGroups[i].groupId;
            }

            this.retVal.securityGroupIds = [];

            for (var i in this.retVal.securityGroups) {
                var sgId = securityGroupsMap[this.retVal.securityGroups[i]];
                if (sgId) { this.retVal.securityGroupIds.push(sgId); }
            }

            this.retVal.securityGroups = null;
            this.retVal.ipAddress = document.getElementById("ec2ui.newinstances.ipAddress").value.trim();
            this.retVal.assignPublicIp = document.getElementById("ec2ui.newinstances.assignPublicIp").checked;
        } else {
            this.retVal.subnetId = null;
            this.retVal.ipAddress = null;
            this.retVal.assignPublicIp = false;
        }

        // This will be an empty string if <none> is selected
        this.retVal.keyName = document.getElementById("ec2ui.newinstances.keypairlist").selectedItem.value;

        // This will be an empty string if <any> is selected
        var a = document.getElementById("ec2ui.newinstances.availabilityzonelist").selectedItem.value;
        this.retVal.placement = {
            "availabilityZone": document.getElementById("ec2ui.newinstances.availabilityzonelist").selectedItem.value
        };

        this.retVal.userData = document.getElementById("ec2ui.newinstances.userdata").value;
        if (this.retVal.userData == "") {
            this.retVal.userData = null;
        }
        this.retVal.properties = document.getElementById("ec2ui.newinstances.properties").value;
        if (this.retVal.properties == "") {
            this.retVal.properties = null;
        }
        this.retVal.ephemeral0 = document.getElementById("ec2ui.newinstances.ephemeral0").value;
        this.retVal.ephemeral1 = document.getElementById("ec2ui.newinstances.ephemeral1").value;
        this.retVal.ephemeral2 = document.getElementById("ec2ui.newinstances.ephemeral2").value;
        this.retVal.ephemeral3 = document.getElementById("ec2ui.newinstances.ephemeral3").value;

        this.retVal.iamInstanceProfileArn  = document.getElementById("ec2ui.newinstances.iam.arn").value.trim();
        this.retVal.iamInstanceProfileName = document.getElementById("ec2ui.newinstances.iam.name").value.trim();

        this.retVal.ebsOptimized = document.getElementById("ec2ui.newinstances.ebsOptimized").checked;

        this.retVal.ok = true;

        return true;
    },

    validateMin : function() {
        var textbox = document.getElementById("ec2ui.newinstances.min");
        var val = parseInt(textbox.value);
        if (val <= 0 || isNaN(val)) {
            alert("Minimum value must be a positive integer");
            textbox.select();
            return false;
        }
        return true;
    },

    validateMax : function() {
        // Assumes validateMin has been called
        var maxtextbox = document.getElementById("ec2ui.newinstances.max");
        var maxval = parseInt(maxtextbox.value);
        if (maxval <= 0 || isNaN(maxval)) {
            alert("Maximum value must be a positive integer");
            maxtextbox.select();
            return false;
        }
        var mintextbox = document.getElementById("ec2ui.newinstances.min");
        var minval = parseInt(mintextbox.value);
        if (minval > maxval) {
            alert("Maximum value may not be smaller than minimum value");
            maxtextbox.select();
            return false;
        }
        return true;
    },

    addSecurityGroup : function() {
        var selected_list = [];

        for(var i = 0; i < this.unusedSecGroupsList.getRowCount(); i++) {
            var item = this.unusedSecGroupsList.getItemAtIndex(i);
            if (item.selected && item.label) {
                this.used.push(item.label);
                selected_list.push(item.label);
            }
        }

        for (var i = this.unused.length - 1; i >= 0; i--) {
            for (var j = 0; j < selected_list.length; j++) {
                if (this.unused[i] == selected_list[j]) {
                    this.unused.splice(i, 1);
                    break;
                }
            }
        }

        this.refreshDisplay();
    },

    removeSecurityGroup : function() {
        var selected_list = [];

        for(var i = 0; i < this.usedSecGroupsList.getRowCount(); i++) {
            var item = this.usedSecGroupsList.getItemAtIndex(i);
            if (item.selected && item.label) {
                this.unused.push(item.label);
                selected_list.push(item.label);
            }
        }

        for (var i = this.used.length - 1; i >= 0; i--) {
            for (var j = 0; j < selected_list.length; j++) {
                if (this.used[i] == selected_list[j]) {
                    this.used.splice(i, 1);
                    break;
                }
            }
        }

        this.refreshDisplay();
    },

    useVpcChanged : function() {
        var useVpc = document.getElementById("ec2ui.newinstances.usevpc").checked;

        // Reset VPC and Subnets
        var count = this.vpcMenu.itemCount;
        for(var i = count-1; i >= 0; i--) {
            this.vpcMenu.removeItemAt(i);
        }

        var count = this.subnetMenu.itemCount;
        for(var i = count-1; i >= 0; i--) {
            this.subnetMenu.removeItemAt(i);
        }

        if (useVpc) {
            this.subnetMenu.disabled = false;
            this.vpcMenu.disabled = false;
            document.getElementById("ec2ui.newinstances.ipAddress").disabled = false;
            document.getElementById("ec2ui.newinstances.assignPublicIp").disabled = false;

            var vpcs = this.ec2ui_session.model.getVpcs();
            for (var i in vpcs) {
                this.vpcMenu.appendItem(vpcs[i].cidr + (vpcs[i].tag == null ? (" [" + vpcs[i].id + "]") : (" [" + vpcs[i].tag + "]")), vpcs[i].id);
            }
            this.vpcMenu.selectedIndex = 0;
            this.vpcIdSelected();
        }else{
            this.subnetMenu.disabled = true;
            this.vpcMenu.disabled = true;
            document.getElementById("ec2ui.newinstances.ipAddress").disabled = true;
            document.getElementById("ec2ui.newinstances.assignPublicIp").disabled = true;

            var securityGroups = this.ec2ui_session.model.getSecurityGroups();

            this.used.length = 0;
            this.unused.length = 0;

            for (var i in securityGroups) {
                if (securityGroups[i].vpcId) { continue; }
                if (securityGroups[i].name == "default") {
                    this.used.push(securityGroups[i].name);
                } else {
                    this.unused.push(securityGroups[i].name);
                }
            }

            this.refreshDisplay();
        }
    },

    vpcIdSelected : function() {
        var sel = this.vpcMenu.selectedItem;

        // Reset subnets
        var count = this.subnetMenu.itemCount;
        for(var i = count-1; i >= 0; i--) {
            this.subnetMenu.removeItemAt(i);
        }

        if (sel.value != null && sel.value != '') {
            var subnets = this.ec2ui_session.model.getSubnets();
            for (var i in subnets) {
                if (subnets[i].vpcId == sel.value) {
                   this.subnetMenu.appendItem(subnets[i].cidr + (subnets[i].tag == null ? " (" : " [" + subnets[i].tag + "] (") + subnets[i].availableIp + " IPs available)", subnets[i].id)
                }
            }
            this.subnetMenu.selectedIndex = 0;
        }

        var securityGroups = this.ec2ui_session.model.getSecurityGroups();
        var vpcId = sel ? sel.value : null;

        this.used.length = 0;
        this.unused.length = 0;

        for (var i in securityGroups) {
            if (securityGroups[i].vpcId != vpcId) { continue; }
            if (securityGroups[i].name == "default") {
                this.used.push(securityGroups[i].name);
            } else {
                this.unused.push(securityGroups[i].name);
            }
        }

        this.refreshDisplay();
    },

    loadUserDataFromFile : function(fBinary) {
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, "Load user data", nsIFilePicker.modeLoad);
        fp.appendFilters(nsIFilePicker.filterAll);

        var res = fp.show();
        if (res == nsIFilePicker.returnOK) {
            var userdataFile = fp.file;
            var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance( Components.interfaces.nsIFileInputStream );
            // Open the file for read (01)
            inputStream.init(userdataFile, 0x01, 0400, null);
            var sis = null;
            var contents = null;
            if (fBinary) {
                sis = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
                sis.setInputStream(inputStream);
                contents = sis.readByteArray(sis.available());
                contents = "Base64:" + Base64.encode(contents);
            } else {
                sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
                sis.init(inputStream);
                contents = sis.read(sis.available());
            }

            inputStream.close();

            document.getElementById("ec2ui.newinstances.userdata").value = contents;
        }
    },

    init : function() {
        this.image = window.arguments[0];
        this.ec2ui_session = window.arguments[1];
        this.retVal = window.arguments[2];

        // Get the list of keypair names visible to this user.
        // This will trigger a DescribeKeyPairs if the model
        // doesn't have any keypair info yet. If there are no keypairs,
        // this dialog shouldn't be initialized any further.
        var keypairs = this.ec2ui_session.model.getKeypairs();
        if (keypairs == null) {
            alert ("Please create a keypair before launching an instance");
            return false;
        }

        var keypairMenu = document.getElementById("ec2ui.newinstances.keypairlist");
        keypairMenu.appendItem("<none>", null);
        for(var i in keypairs) {
            keypairMenu.appendItem(keypairs[i].name, keypairs[i].name);
        }
        // If the user created at least one EC2 Keypair, select it.
        keypairMenu.selectedIndex = (keypairs.length > 0) ? 1 : 0;

        var typeMenu = document.getElementById("ec2ui.newinstances.instancetypelist");
        // Add the instance sizes based on AMI architecture
        if (this.image.arch == "x86_64") {
            typeMenu.appendItem("t1.micro (2 ECU/613MB RAM)", "t1.micro");
            typeMenu.appendItem("m1.small (1 ECU/1.7GB RAM)", "m1.small");
            typeMenu.appendItem("m1.medium (2 ECU/3.75GB RAM)", "m1.medium");
            typeMenu.appendItem("c1.medium (5 ECU/1.7GB RAM)", "c1.medium");
            typeMenu.appendItem("m1.large (4 ECU/7.5GB RAM)", "m1.large");
            typeMenu.appendItem("m1.xlarge (8 ECU/15GB RAM)", "m1.xlarge");
            typeMenu.appendItem("c1.xlarge (20 ECU/7GB RAM)", "c1.xlarge");
            typeMenu.appendItem("m3.medium (3 ECU/3.75 GB RAM)", "m3.medium");
            typeMenu.appendItem("m3.large (6.5 ECU/7 GB RAM)", "m3.large");
            typeMenu.appendItem("m3.xlarge (13 ECU/15 GB RAM)", "m3.xlarge");
            typeMenu.appendItem("m3.2xlarge (26 ECU/30 GB RAM)", "m3.2xlarge");
            typeMenu.appendItem("m2.xlarge (6.5 ECU/17.1GB RAM)", "m2.xlarge");
            typeMenu.appendItem("m2.2xlarge (13 ECU/34.2 GB RAM)", "m2.2xlarge");
            typeMenu.appendItem("m2.4xlarge (26 ECU/68.4 GB RAM)", "m2.4xlarge");
            typeMenu.appendItem("cc1.4xlarge (33.5 ECU/23 GB RAM)", "cc1.4xlarge");
            typeMenu.appendItem("cc2.8xlarge (88 ECU/60.5 GB RAM)", "cc2.8xlarge");
            typeMenu.appendItem("cg1.4xlarge (33.5 ECU/22 GB RAM)", "cg1.4xlarge");
            typeMenu.appendItem("hi1.4xlarge (35 ECU/60.5 GB RAM)", "hi1.4xlarge");
            typeMenu.appendItem("hs1.8xlarge (35 ECU/117 GB RAM)", "hs1.8xlarge");
            typeMenu.appendItem("i2.xlarge (14 ECU/30.5 GB RAM)", "i2.xlarge");
            typeMenu.appendItem("i2.2xlarge (27 ECU/61 GB RAM)", "i2.2xlarge");
            typeMenu.appendItem("i2.4xlarge (53 ECU/122 GB RAM)", "i2.4xlarge");
            typeMenu.appendItem("i2.8xlarge (104 ECU/244 GB RAM)", "i2.8xlarge");
            typeMenu.appendItem("c3.large (7 ECU/3.75 GB RAM)", "c3.large");
            typeMenu.appendItem("c3.xlarge (14 ECU/7 GB RAM)", "c3.xlarge");
            typeMenu.appendItem("c3.2xlarge (28 ECU/15 GB RAM)", "c3.2xlarge");
            typeMenu.appendItem("c3.4xlarge (55 ECU/30 GB RAM)", "c3.4xlarge");
            typeMenu.appendItem("c3.8xlarge (108 ECU/60 GB RAM)", "c3.8xlarge");
            typeMenu.appendItem("r3.large (6.5 ECU/15 GB RAM)", "r3.large");
            typeMenu.appendItem("r3.xlarge (13 ECU/30.5 GB RAM)", "r3.xlarge");
            typeMenu.appendItem("r3.2xlarge (26 ECU/61 GB RAM)", "r3.2xlarge");
            typeMenu.appendItem("r3.4xlarge (52 ECU/122 GB RAM)", "r3.4xlarge");
            typeMenu.appendItem("r3.8xlarge (104 ECU/244 GB RAM)", "c3.8xlarge");
            typeMenu.appendItem("cr1.8xlarge (88 ECU/30 GB RAM)", "cr1.8xlarge");
            typeMenu.appendItem("g2.2xlarge (26 ECU/244 GB RAM)", "g2.2xlarge");
        } else {
            typeMenu.appendItem("t1.micro (2 ECU/613MB RAM)", "t1.micro");
            typeMenu.appendItem("m1.small (1 ECU/1.7GB RAM)", "m1.small");
            typeMenu.appendItem("m1.medium (2 ECU/3.75GB RAM)", "m1.medium");
            typeMenu.appendItem("c1.medium (5 ECU/1.7GB RAM)", "c1.medium");
        }
        typeMenu.selectedIndex = 0;

        var textBox = document.getElementById("ec2ui.newinstances.ami");
        textBox.value = this.image.id;

        textBox = document.getElementById("ec2ui.newinstances.ami.tag");
        textBox.value = this.image.tag || "";

        textBox = document.getElementById("ec2ui.newinstances.ami.location");
        textBox.value = this.image.location.split('/').pop();

        textBox = document.getElementById("ec2ui.newinstances.min");
        textBox.focus();

        // availability zones
        var availZoneMenu = document.getElementById("ec2ui.newinstances.availabilityzonelist");
        availZoneMenu.appendItem("<any>", null);
        var availZones = this.ec2ui_session.model.getAvailabilityZones();
        for (var i in availZones) {
            availZoneMenu.appendItem(availZones[i].name + " (" + availZones[i].state + ")", availZones[i].name);
        }
        availZoneMenu.selectedIndex = 0;

        // vpcs
        this.vpcMenu = document.getElementById("ec2ui.newinstances.vpcId");
        this.vpcMenu.disabled = true;

        // subnets
        this.subnetMenu = document.getElementById("ec2ui.newinstances.subnetId");
        this.subnetMenu.disabled = true;

        document.getElementById("ec2ui.newinstances.ipAddress").disabled = true;
        document.getElementById("ec2ui.newinstances.assignPublicIp").disabled = true;

        // Grab handles to the unused and used security group lists.
        this.unusedSecGroupsList = document.getElementById("ec2ui.newinstances.secgroups.unused");
        this.usedSecGroupsList = document.getElementById("ec2ui.newinstances.secgroups.used");

        // Get the list of security groups visible to this user. This will trigger a DescribeSecurityGroups
        // if the model doesn't have any info yet.
        var securityGroups = this.ec2ui_session.model.getSecurityGroups();

        // Then add the default group to the used list. EC2 will do this anyway if no group is provided,
        // but this way it's obvious to the user what's happening.
        i = 0;
        for (i in securityGroups) {
            if (securityGroups[i].vpcId) { continue; }
            if (securityGroups[i].name == "default") {
                this.used.push(securityGroups[i].name);
            } else {
                this.unused.push(securityGroups[i].name);
            }
        }

        var aki = this.image.aki;
        var ari = this.image.ari;

        // Populate the AKI and ARI lists
        var akiList = document.getElementById("ec2ui.newinstances.aki");
        var ariList = document.getElementById("ec2ui.newinstances.ari");
        var images = this.ec2ui_session.model.getImages();
        var akiRegex = regExs["aki"];
        var ariRegex = regExs["ari"];
        akiList.appendItem("");
        ariList.appendItem("");

        if (!isWindows(this.image.platform)) {
            i = 0;
            var imgId = null;
            for (i in images) {
                imgId = images[i].id;
                if (imgId.match(akiRegex)) {
                    akiList.appendItem(imgId);
                    continue;
                }

                if (imgId.match(ariRegex)) {
                    ariList.appendItem(imgId);
                }
            }

            akiList.value = aki;
            ariList.value = ari;

            // The use of selectedIndex doesn't work predictably for
            // editable menulists
        }

        this.refreshDisplay();
    },

    refreshDisplay : function() {
        while(this.unusedSecGroupsList.getRowCount() > 0) { this.unusedSecGroupsList.removeItemAt(0); }
        while(this.usedSecGroupsList.getRowCount() > 0) { this.usedSecGroupsList.removeItemAt(0); }

        this.unused.sort();
        this.used.sort();

        for(var i in this.unused) { this.unusedSecGroupsList.appendItem(this.unused[i]); }
        for(var i in this.used) { this.usedSecGroupsList.appendItem(this.used[i]); }
    }
}
