// controller: slightly higher level of abstraction over the EC2 API
var ec2ui_controller = {
    getNsResolver : function() {
        return ec2_httpclient.getNsResolver();
    },

    registerImageInRegion : function(manifestPath, region, callback) {
        // Determine the current region
        var activeReg = ec2ui_utils.determineRegionFromString(ec2ui_session.getActiveEndpoint().name);
        log(activeReg + ": active, requested: " + region);

        if (activeReg == region) {
            // The image's region is the same as the active region
            this.registerImage(manifestPath, callback);
        } else {
            ec2_httpclient.queryEC2InRegion(region,
                                            "RegisterImage",
                                            [["ImageLocation", manifestPath]],
                                            this,
                                            true,
                                            "onCompleteRegisterImage",
                                            callback);
        }
    },

    registerImage : function (manifestPath, callback) {
        ec2_httpclient.queryEC2("RegisterImage", [["ImageLocation", manifestPath]], this, true, "onCompleteRegisterImage", callback);
    },

    registerImageFromSnapshot : function (snapshotId, amiName, amiDescription, architecture, kernelId, ramdiskId, deviceName, deleteOnTermination, callback) {
        var params = [];

        params.push(['Name', amiName]);
        amiDescription && params.push(['Description', amiDescription]);
        params.push(['Architecture', architecture]);
        kernelId && params.push(['KernelId', kernelId]);
        ramdiskId && params.push(['RamdiskId', ramdiskId]);
        params.push(['RootDeviceName', deviceName]);
        params.push(['BlockDeviceMapping.1.DeviceName', deviceName]);
        params.push(['BlockDeviceMapping.1.Ebs.SnapshotId', snapshotId]);
        params.push(['BlockDeviceMapping.1.Ebs.DeleteOnTermination', deleteOnTermination]);

        ec2_httpclient.queryEC2("RegisterImage", params, this, true, "onCompleteRegisterImage", callback);
    },

    onCompleteRegisterImage : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var imageId = getNodeValueByName(xmlDoc, "imageId");

        if (objResponse.callback)
            objResponse.callback(imageId);
    },

    deregisterImage : function (imageId, callback) {
        ec2_httpclient.queryEC2("DeregisterImage", [["ImageId", imageId]], this, true, "onCompleteDeregisterImage", callback);
    },

    onCompleteDeregisterImage : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    createSnapshot : function (volumeId, callback) {
        ec2_httpclient.queryEC2("CreateSnapshot", [["VolumeId", volumeId]], this, true, "onCompleteCreateSnapshot", callback);
    },

    onCompleteCreateSnapshot: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var id = getNodeValueByName(xmlDoc, "snapshotId");

        if (objResponse.callback)
            objResponse.callback(id);
    },

    attachVolume: function (volumeId, instanceId, device, callback) {
        var params = []
        if (volumeId != null) params.push(["VolumeId", volumeId]);
        if (instanceId != null) params.push(["InstanceId", instanceId]);
        if (device != null) params.push(["Device", device]);
        ec2_httpclient.queryEC2("AttachVolume", params, this, true, "onCompleteAttachVolume", callback);
    },

    onCompleteAttachVolume: function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    createVolume : function (size, snapshotId, zone, volumeType, iops, encrypted, callback) {
        var params = []
        if (size != null) params.push(["Size", size]);
        if (snapshotId != null) params.push(["SnapshotId", snapshotId]);
        if (zone != null) params.push(["AvailabilityZone", zone]);
        if (volumeType != null) params.push(["VolumeType", volumeType]);
        if (volumeType && volumeType == 'io1' && iops != null) params.push(["Iops", iops]);
        if (encrypted != null) params.push(["Encrypted", encrypted]);
        ec2_httpclient.queryEC2("CreateVolume", params, this, true, "onCompleteCreateVolume", callback);
    },

    onCompleteCreateVolume: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var id = getNodeValueByName(xmlDoc, "volumeId");
        if (objResponse.callback)
            objResponse.callback(id);
    },

    deleteSnapshot : function (snapshotId, callback) {
        ec2_httpclient.queryEC2("DeleteSnapshot", [["SnapshotId", snapshotId]], this, true, "onCompleteDeleteSnapshot", callback);
    },

    onCompleteDeleteSnapshot: function (objResponse) {
        ec2ui_SnapshotTreeView.refresh();
        if (objResponse.callback)
            objResponse.callback();
    },

    copySnapshot : function (snapshotId, destRegion, description, callback) {
        var params = [
            ["SourceSnapshotId", snapshotId],
            ["SourceRegion", ec2ui_session.getActiveEndpoint().name]
        ];

        if (description) {
            params.push(["Description", description]);
        }

        ec2_httpclient.queryEC2InRegion(destRegion, "CopySnapshot", params, this, true, "onCompleteCopySnapshot", callback);
    },

    onCompleteCopySnapshot: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var snapshotId = getNodeValueByName(xmlDoc, "snapshotId");

        if (objResponse.callback) {
            objResponse.callback(snapshotId);
        }
    },

    deleteVolume : function (volumeId, callback) {
        ec2_httpclient.queryEC2("DeleteVolume", [["VolumeId", volumeId]], this, true, "onCompleteDeleteVolume", callback);
    },

    onCompleteDeleteVolume: function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    detachVolume : function (volumeId, callback) {
        ec2_httpclient.queryEC2("DetachVolume", [["VolumeId", volumeId]], this, true, "onCompleteDetachVolume", callback);
    },

    forceDetachVolume : function (volumeId, callback) {
        ec2_httpclient.queryEC2("DetachVolume", [["VolumeId", volumeId], ["Force", true]], this, true, "onCompleteDetachVolume", callback);
    },

    onCompleteDetachVolume: function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeVolumes : function (callback) {
        ec2_httpclient.queryEC2("DescribeVolumes", [], this, true, "onCompleteDescribeVolumes", callback);
    },

    onCompleteDescribeVolumes : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var tags = new Object();
        var items = xmlDoc.evaluate("/ec2:DescribeVolumesResponse/ec2:volumeSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "volumeId");
            var size = getNodeValueByName(items.snapshotItem(i), "size");
            var snapshotId = getNodeValueByName(items.snapshotItem(i), "snapshotId");

            var zone = getNodeValueByName(items.snapshotItem(i), "availabilityZone");
            var status = getNodeValueByName(items.snapshotItem(i), "status");
            var createTime = new Date();
            createTime.setISO8601(getNodeValueByName(items.snapshotItem(i), "createTime"));
            var volumeType = getNodeValueByName(items.snapshotItem(i), "volumeType");
            var iops = getNodeValueByName(items.snapshotItem(i), "iops");
            var encrypted = getNodeValueByName(items.snapshotItem(i), "encrypted");

            // Zero out the values for attachment
            var instanceId = "";
            var device = "";
            var attachStatus = "";
            var attachTime = new Date();
            // Make sure there is an attachment
            if (items.snapshotItem(i).getElementsByTagName("attachmentSet")[0].firstChild) {
                instanceId = getNodeValueByName(items.snapshotItem(i), "instanceId");
                device = getNodeValueByName(items.snapshotItem(i), "device");
                attachStatus = items.snapshotItem(i).getElementsByTagName("status")[1].firstChild;
                if (attachStatus) {
                    attachStatus = attachStatus.nodeValue;
                }
                attachTime.setISO8601(getNodeValueByName(items.snapshotItem(i), "attachTime"));
            }
            list.push(new Volume(id, size, snapshotId, zone, status, createTime, instanceId, device, attachStatus, attachTime, volumeType, iops, encrypted));

            this.walkTagSet(items.snapshotItem(i), "volumeId", tags);
        }

        this.addEC2Tag(list, "id", tags);
        ec2ui_model.updateVolumes(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeSnapshots : function (callback) {
        ec2_httpclient.queryEC2("DescribeSnapshots", [], this, true, "onCompleteDescribeSnapshots", callback);
    },

    onCompleteDescribeSnapshots: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var tags = new Object();
        var items = xmlDoc.evaluate("/ec2:DescribeSnapshotsResponse/ec2:snapshotSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "snapshotId");
            var volumeId = getNodeValueByName(items.snapshotItem(i), "volumeId");
            var status = getNodeValueByName(items.snapshotItem(i), "status");
            var startTime = new Date();
            startTime.setISO8601(getNodeValueByName(items.snapshotItem(i), "startTime"));
            var progress = getNodeValueByName(items.snapshotItem(i), "progress");
            var volumeSize = getNodeValueByName(items.snapshotItem(i), "volumeSize");
            var description = getNodeValueByName(items.snapshotItem(i), "description");
            var ownerId = getNodeValueByName(items.snapshotItem(i), "ownerId")
            var ownerAlias = getNodeValueByName(items.snapshotItem(i), "ownerAlias")
            list.push(new Snapshot(id, volumeId, status, startTime, progress, volumeSize, description, ownerId, ownerAlias));

            this.walkTagSet(items.snapshotItem(i), "snapshotId", tags);
        }

        this.addEC2Tag(list, "id", tags);
        ec2ui_model.updateSnapshots(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeVpcs : function (isSync, callback) {
        if (!isSync) isSync = false;
        if (!this.descVpcsInProgress) {
            this.descVpcsInProgress = true;
            ec2_httpclient.queryEC2("DescribeVpcs", [], this, isSync, "onCompleteDescribeVpcs", callback);
        }
    },

    onCompleteDescribeVpcs : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeVpcsResponse/ec2:vpcSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for (var i = 0; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "vpcId");
            var cidr = getNodeValueByName(items.snapshotItem(i), "cidrBlock");
            var state = getNodeValueByName(items.snapshotItem(i), "state");
            var dhcpopts = getNodeValueByName(items.snapshotItem(i), "dhcpOptionsId");
            list.push(new Vpc(id, cidr, state, dhcpopts));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.vpcs, "id");
        ec2ui_model.updateVpcs(list);
        this.descVpcsInProgress = false;
        if (objResponse.callback)
            objResponse.callback(list);
    },

    createVpc : function (cidr, callback) {
        ec2_httpclient.queryEC2("CreateVpc", [["CidrBlock", cidr]], this, true, "onCompleteCreateVpc", callback);
    },

    onCompleteCreateVpc : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteVpc : function (id, callback) {
        ec2_httpclient.queryEC2("DeleteVpc", [["VpcId", id]], this, true, "onCompleteDeleteVpc", callback);
    },

    onCompleteDeleteVpc : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeSubnets : function (isSync, callback) {
        if (!isSync) isSync = false;
        if (!this.descSubnetsInProgress) {
            this.descSubnetsInProgress = true;
            ec2_httpclient.queryEC2("DescribeSubnets", [], this, isSync, "onCompleteDescribeSubnets", callback);
        }
    },

    onCompleteDescribeSubnets : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeSubnetsResponse/ec2:subnetSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for (var i = 0; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "subnetId");
            var vpcId = getNodeValueByName(items.snapshotItem(i), "vpcId");
            var cidrBlock = getNodeValueByName(items.snapshotItem(i), "cidrBlock");
            var state = getNodeValueByName(items.snapshotItem(i), "state");
            var availableIp = getNodeValueByName(items.snapshotItem(i), "availableIpAddressCount");
            var availabilityZone = getNodeValueByName(items.snapshotItem(i), "availabilityZone");
            list.push(new Subnet(id,
                                 vpcId,
                                 cidrBlock,
                                 state,
                                 availableIp,
                                 availabilityZone));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.subnets, "id");
        ec2ui_model.updateSubnets(list);
        this.descSubnetsInProgress = false;
        if (objResponse.callback)
            objResponse.callback(list);
    },

    createSubnet : function (vpcId, cidr, az, callback) {
        ec2_httpclient.queryEC2("CreateSubnet", [["CidrBlock", cidr], ["VpcId", vpcId], ["AvailabilityZone", az]], this, true, "onCompleteCreateSubnet", callback);
    },

    onCompleteCreateSubnet : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteSubnet : function (id, callback) {
        ec2_httpclient.queryEC2("DeleteSubnet", [["SubnetId", id]], this, true, "onCompleteDeleteSubnet", callback);
    },

    onCompleteDeleteSubnet : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeDhcpOptions : function (isSync, callback) {
        if (!isSync) isSync = false;
        if (!this.descDhcpOptionsInProgress) {
            this.descDhcpOptionsInProgress = true;
            ec2_httpclient.queryEC2("DescribeDhcpOptions", [], this, isSync, "onCompleteDescribeDhcpOptions", callback);
        }
    },

    onCompleteDescribeDhcpOptions : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeDhcpOptionsResponse/ec2:dhcpOptionsSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for (var i = 0; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "dhcpOptionsId");
            var options = new Array();

            var optTags = items.snapshotItem(i).getElementsByTagName("dhcpConfigurationSet")[0];
            var optItems = optTags.childNodes;
            log ("Parsing DHCP Options: "+optItems.length+" option sets");

            for (var j = 0; j < optItems.length; j++) {
                if (optItems.item(j).nodeName == '#text') continue;
                var key = getNodeValueByName(optItems.item(j), "key");
                var values = new Array();

                var valtags = optItems.item(j).getElementsByTagName("valueSet")[0];
                var valItems = valtags.childNodes;
                log ("Parsing DHCP Option "+key+": "+valItems.length+" values");

                for (var k = 0; k < valItems.length; k++) {
                    if (valItems.item(k).nodeName == '#text') continue;
                    values.push(getNodeValueByName(valItems.item(k), "value"));
                }
                options.push(key + " = " + values.join(","))
            }
            list.push(new DhcpOptions(id, options.join("; ")));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.dhcpOptions, "id");
        ec2ui_model.updateDhcpOptions(list);
        this.descDhcpOptionsInProgress = false;
        if (objResponse.callback)
            objResponse.callback(list);
    },

    associateDhcpOptions : function (dhcpOptionsId, vpcId, callback) {
       ec2_httpclient.queryEC2("AssociateDhcpOptions", [["DhcpOptionsId", dhcpOptionsId], ["VpcId", vpcId]], this, true, "onCompleteAssociateDhcpOptions", callback);
    },

    onCompleteAssociateDhcpOptions : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    createDhcpOptions : function (opts, callback) {
       var params = new Array();

       for (var i = 0; i < opts.length; i++) {
           if (opts[i][1] == null || opts[i][1].length == 0)
               continue;

           params.push(["DhcpConfiguration." + (i+1) + ".Key", opts[i][0]]);
           for (var j = 0; j < opts[i][1].length; j++) {
               params.push(["DhcpConfiguration." + (i+1) + ".Value." + (j+1),
                            opts[i][1][j]]);
           }
       }

       ec2_httpclient.queryEC2("CreateDhcpOptions", params, this, true, "onCompleteCreateDhcpOptions", callback);
    },

    onCompleteCreateDhcpOptions : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteDhcpOptions : function (id, callback) {
        ec2_httpclient.queryEC2("DeleteDhcpOptions", [["DhcpOptionsId", id]], this, true, "onCompleteDeleteDhcpOptions", callback);
    },

    onCompleteDeleteDhcpOptions : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeVpnGateways : function (isSync, callback) {
        if (!isSync) isSync = false;
        if (!this.descVpnGatewaysInProgress) {
            this.descVpnGatewaysInProgress = true;
            ec2_httpclient.queryEC2("DescribeVpnGateways", [], this, isSync, "onCompleteDescribeVpnGateways", callback);
        }
    },

    onCompleteDescribeVpnGateways : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeVpnGatewaysResponse/ec2:vpnGatewaySet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for (var i = 0; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "vpnGatewayId");
            var availabilityZone = getNodeValueByName(items.snapshotItem(i), "availabilityZone");
            var type = getNodeValueByName(items.snapshotItem(i), "type");
            var state = getNodeValueByName(items.snapshotItem(i), "state");
            var attachments = new Array();

            var atttags = items.snapshotItem(i).getElementsByTagName("attachments")[0].getElementsByTagName("item");
            for (var j = 0; j < atttags.length; j++) {
                var vpcId = getNodeValueByName(atttags[j], "vpcId");
                var attstate = getNodeValueByName(atttags[j], "state");
                var att = new VpnGatewayAttachment(vpcId, id, attstate)
                attachments.push(att)
            }
            list.push(new VpnGateway(id,
                                     availabilityZone,
                                     state,
                                     type,
                                     attachments));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.vpnGateways, "id");
        ec2ui_model.updateVpnGateways(list);
        this.descVpnGatewaysInProgress = false;
        if (objResponse.callback)
            objResponse.callback(list);
    },

    createVpnGateway : function (type, az, callback) {
        ec2_httpclient.queryEC2("CreateVpnGateway", [["Type", type], ["AvailabilityZone", az]], this, true, "onCompleteCreateVpnGateway", callback);
    },

    onCompleteCreateVpnGateway : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteVpnGateway : function (id, callback) {
        ec2_httpclient.queryEC2("DeleteVpnGateway", [["VpnGatewayId", id]], this, true, "onCompleteDeleteVpnGateway", callback);
    },

    onCompleteDeleteVpnGateway : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeCustomerGateways : function (isSync, callback) {
        if (!isSync) isSync = false;
        if (!this.descCustomerGatewaysInProgress) {
            this.descCustomerGatewaysInProgress = true;
            ec2_httpclient.queryEC2("DescribeCustomerGateways", [], this, isSync, "onCompleteDescribeCustomerGateways", callback);
        }
    },

    onCompleteDescribeCustomerGateways : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeCustomerGatewaysResponse/ec2:customerGatewaySet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for (var i = 0; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "customerGatewayId");
            var type = getNodeValueByName(items.snapshotItem(i), "type");
            var state = getNodeValueByName(items.snapshotItem(i), "state");
            var ipAddress = getNodeValueByName(items.snapshotItem(i), "ipAddress");
            var bgpAsn = getNodeValueByName(items.snapshotItem(i), "bgpAsn");
            list.push(new CustomerGateway(id,
                                          ipAddress,
                                          bgpAsn,
                                          state,
                                          type));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.customerGateways, "id");
        ec2ui_model.updateCustomerGateways(list);
        this.descCustomerGatewaysInProgress = false;
        if (objResponse.callback)
            objResponse.callback(list);
    },

    createCustomerGateway : function (type, ip, asn, callback) {
        ec2_httpclient.queryEC2("CreateCustomerGateway", [["Type", type], ["IpAddress", ip], ["BgpAsn", asn]], this, true, "onCompleteCreateCustomerGateway", callback);
    },

    onCompleteCreateCustomerGateway : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteCustomerGateway : function (id, callback) {
        ec2_httpclient.queryEC2("DeleteCustomerGateway", [["CustomerGatewayId", id]], this, true, "onCompleteDeleteCustomerGateway", callback);
    },

    onCompleteDeleteCustomerGateway : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeVpnConnections : function (isSync, callback) {
        if (!isSync) isSync = false;
        if (!this.descVpnConnectionsInProgress) {
            this.descVpnConnectionsInProgress = true;
            ec2_httpclient.queryEC2("DescribeVpnConnections", [], this, isSync, "onCompleteDescribeVpnConnections", callback);
        }
    },

    onCompleteDescribeVpnConnections : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        // required due to the size of the customer gateway config
        // being very close to or in excess of 4096 bytes
        xmlDoc.normalize();

        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeVpnConnectionsResponse/ec2:vpnConnectionSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for (var i = 0; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "vpnConnectionId");
            var cgwId = getNodeValueByName(items.snapshotItem(i), "customerGatewayId");
            var vgwId = getNodeValueByName(items.snapshotItem(i), "vpnGatewayId");
            var type = getNodeValueByName(items.snapshotItem(i), "type");
            var state = getNodeValueByName(items.snapshotItem(i), "state");
            var ipAddress = getNodeValueByName(items.snapshotItem(i), "ipAddress");
            // Required since Firefox limits nodeValue to 4096 bytes
            var cgwtag = items.snapshotItem(i).getElementsByTagName("customerGatewayConfiguration")
            var config = null;
            if (cgwtag[0]) {
               config = cgwtag[0].textContent;
            }

            var bgpAsn = getNodeValueByName(items.snapshotItem(i), "bgpAsn");

            list.push(new VpnConnection(id,
                                        vgwId,
                                        cgwId,
                                        type,
                                        state,
                                        config));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.vpnConnections, "id");
        ec2ui_model.updateVpnConnections(list);
        this.descVpnConnectionsInProgress = false;
        if (objResponse.callback)
            objResponse.callback(list);
    },

    createVpnConnection : function (type, cgwid, vgwid, callback) {
        ec2_httpclient.queryEC2("CreateVpnConnection", [["Type", type], ["CustomerGatewayId", cgwid], ["VpnGatewayId", vgwid]], this, true, "onCompleteCreateVpnConnection", callback);
    },

    onCompleteCreateVpnConnection : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteVpnConnection : function (id, callback) {
        ec2_httpclient.queryEC2("DeleteVpnConnection", [["VpnConnectionId", id]], this, true, "onCompleteDeleteVpnConnection", callback);
    },

    onCompleteDeleteVpnConnection : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    attachVpnGatewayToVpc : function (vgwid, vpcid, callback) {
        ec2_httpclient.queryEC2("AttachVpnGateway", [["VpnGatewayId", vgwid], ["VpcId", vpcid]], this, true, "onCompleteAttachVpnGatewayToVpc", callback);
    },

    onCompleteAttachVpnGatewayToVpc : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    detachVpnGatewayFromVpc : function (vgwid, vpcid, callback) {
        ec2_httpclient.queryEC2("DetachVpnGateway", [["VpnGatewayId", vgwid], ["VpcId", vpcid]], this, true, "onCompleteDetachVpnGatewayFromVpc", callback);
    },

    onCompleteDetachVpnGatewayFromVpc : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeImage : function (imageId, callback) {
        ec2_httpclient.queryEC2("DescribeImages", [["ImageId", imageId]], this, true, "onCompleteDescribeImage", callback);
    },

    onCompleteDescribeImage: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeImagesResponse/ec2:imagesSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        var item = items.snapshotItem(0);
        var ami = null;

        if (item) {
            var imageId = getNodeValueByName(item, "imageId");
            var imageLocation = getNodeValueByName(item, "imageLocation");
            var imageState = getNodeValueByName(item, "imageState");
            var owner = getNodeValueByName(item, "imageOwnerId");
            var isPublic = getNodeValueByName(item, "isPublic");

            // This value might not exist, but getNodeValueByName
            // returns "" in case the element is not defined.
            var platform = getNodeValueByName(item, "platform");
            var aki = getNodeValueByName(item, "kernelId");
            var ari = getNodeValueByName(item, "ramdiskId");

            var rdt = getNodeValueByName(item, "rootDeviceType");
            var ownerAlias = getNodeValueByName(item, "imageOwnerAlias");
            var name = getNodeValueByName(item, "name");
            var description = getNodeValueByName(item, "description");
            var snapshotId = getNodeValueByName(item, "snapshotId");

            ami = new AMI(imageId, imageLocation, imageState, owner, (isPublic == 'true' ? 'public' : 'private'), platform, aki, ari, rdt, ownerAlias, name, description, snapshotId);
        }

        ec2ui_model.addToAmiManifestMap(ami);
        if (objResponse.callback && ami)
            objResponse.callback(ami);
    },

    createImage : function(instanceId, amiName, amiDescription, noReboot, callback) {
        var noRebootVal = "false";
        if (noReboot == true)
            noRebootVal = "true";

        ec2_httpclient.queryEC2("CreateImage", [["InstanceId", instanceId], ["Name", amiName], ["Description", amiDescription], ["NoReboot", noRebootVal]], this, true, "onCompleteCreateImage", callback);
    },

    onCompleteCreateImage : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var id = getNodeValueByName(xmlDoc, "imageId");

        if (objResponse.callback)
            objResponse.callback(id);
    },

    describeImages : function (isSync, callback) {
        if (!isSync) isSync = false;
        ec2_httpclient.queryEC2("DescribeImages", [], this, isSync, "onCompleteDescribeImages", callback);
    },

    onCompleteDescribeImages : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var tags = new Object();
        var img = null;
        var items = xmlDoc.evaluate("/ec2:DescribeImagesResponse/ec2:imagesSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var imageId = getNodeValueByName(items.snapshotItem(i), "imageId");
            var imageLocation = getNodeValueByName(items.snapshotItem(i), "imageLocation");
            var imageState = getNodeValueByName(items.snapshotItem(i), "imageState");
            var owner = getNodeValueByName(items.snapshotItem(i), "imageOwnerId");
            var isPublic = getNodeValueByName(items.snapshotItem(i), "isPublic");
            var arch = getNodeValueByName(items.snapshotItem(i), "architecture");
            var rdt = getNodeValueByName(items.snapshotItem(i), "rootDeviceType");
            var ownerAlias = getNodeValueByName(items.snapshotItem(i), "imageOwnerAlias");
            var name = getNodeValueByName(items.snapshotItem(i), "name");
            var description = getNodeValueByName(items.snapshotItem(i), "description");
            var snapshotId = getNodeValueByName(items.snapshotItem(i), "snapshotId");

            // These value might not exist, but getNodeValueByName
            // returns "" in case the element is not defined.
            var platform = getNodeValueByName(items.snapshotItem(i), "platform");
            var aki = getNodeValueByName(items.snapshotItem(i), "kernelId");
            var ari = getNodeValueByName(items.snapshotItem(i), "ramdiskId");

            list.push(new AMI(imageId,
                          imageLocation,
                          imageState,
                          owner,
                          (isPublic == 'true' ? 'public' : 'private'),
                          arch,
                          platform,
                          aki,
                          ari,
                          rdt,
                          ownerAlias,
                          name,
                          description,
                          snapshotId));


            this.walkTagSet(items.snapshotItem(i), "imageId", tags);
        }

        this.addEC2Tag(list, "id", tags);
        ec2ui_model.updateImages(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeLeaseOfferings : function (callback) {
        ec2_httpclient.queryEC2("DescribeReservedInstancesOfferings", [], this, true, "onCompleteDescribeLeaseOfferings", callback);
    },

    onCompleteDescribeLeaseOfferings : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var img = null;
        var items = xmlDoc.evaluate("/ec2:DescribeReservedInstancesOfferingsResponse/ec2:reservedInstancesOfferingsSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var id = getNodeValueByName(items.snapshotItem(i), "reservedInstancesOfferingId");
            var type = getNodeValueByName(items.snapshotItem(i), "instanceType");
            var az = getNodeValueByName(items.snapshotItem(i), "availabilityZone");
            var duration = secondsToYears(getNodeValueByName(items.snapshotItem(i), "duration"));
            var fPrice = parseInt(getNodeValueByName(items.snapshotItem(i), "fixedPrice")).toString();
            var uPrice = getNodeValueByName(items.snapshotItem(i), "usagePrice");
            var desc = getNodeValueByName(items.snapshotItem(i), "productDescription");

            list.push(new LeaseOffering(id,
                                        type,
                                        az,
                                        duration,
                                        fPrice,
                                        uPrice,
                                        desc));
        }

        ec2ui_model.updateLeaseOfferings(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeReservedInstances : function (callback) {
        ec2_httpclient.queryEC2("DescribeReservedInstances", [], this, true, "onCompleteDescribeReservedInstances", callback);
    },

    onCompleteDescribeReservedInstances : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var img = null;
        var items = xmlDoc.evaluate("/ec2:DescribeReservedInstancesResponse/ec2:reservedInstancesSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var item = items.snapshotItem(i);
            var id = getNodeValueByName(item, "reservedInstancesId");
            var type = getNodeValueByName(item, "instanceType");
            var az = getNodeValueByName(item, "availabilityZone");
            var start = new Date();
            start.setISO8601(getNodeValueByName(item, "start"));
            var duration = secondsToYears(getNodeValueByName(item, "duration"));
            var fPrice = parseInt(getNodeValueByName(item, "fixedPrice")).toString();
            var uPrice = getNodeValueByName(item, "usagePrice");
            var count = getNodeValueByName(item, "instanceCount");
            var desc = getNodeValueByName(item, "productDescription");
            var state = getNodeValueByName(item, "state");

            list.push(new ReservedInstance(id,
                                           type,
                                           az,
                                           start,
                                           duration,
                                           fPrice,
                                           uPrice,
                                           count,
                                           desc,
                                           state));
        }

        ec2ui_model.updateReservedInstances(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    purchaseOffering : function (id, count, callback) {
        ec2_httpclient.queryEC2("PurchaseReservedInstancesOffering",
                                [["ReservedInstancesOfferingId", id], ["InstanceCount", count]],
                                this,
                                true,
                                "onCompletePurchaseOffering",
                                callback);
    },

    onCompletePurchaseOffering : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var id = getNodeValueByName(xmlDoc, "reservedInstancesId");

        if (objResponse.callback)
            objResponse.callback(id);
    },

    describeLaunchPermissions : function (imageId, callback) {
        ec2_httpclient.queryEC2("DescribeImageAttribute", [["ImageId", imageId], ["Attribute","launchPermission"]], this, true, "onCompleteDescribeLaunchPermissions", callback);
    },

    onCompleteDescribeLaunchPermissions : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            if (items[i].getElementsByTagName("group")[0]) {
                list.push(getNodeValueByName(items[i], "group"));
            }
            if (items[i].getElementsByTagName("userId")[0]) {
                list.push(getNodeValueByName(items[i], "userId"));
            }
        }

        if (objResponse.callback)
            objResponse.callback(list);
    },

    addLaunchPermission : function (imageId, name, callback) {
        var params = []
        params.push(["ImageId", imageId]);
        params.push(["Attribute","launchPermission"]);
        params.push(["OperationType", "add"]);
        if (name == "all") {
            params.push(["UserGroup.1", name]);
        } else {
            params.push(["UserId.1", name]);
        }
        ec2_httpclient.queryEC2("ModifyImageAttribute", params, this, true, "onCompleteModifyImageAttribute", callback);
    },

    revokeLaunchPermission : function (imageId, name, callback) {
        var params = []
        params.push(["ImageId", imageId]);
        params.push(["Attribute","launchPermission"]);
        params.push(["OperationType", "remove"]);
        if (name == "all") {
            params.push(["UserGroup.1", name]);
        } else {
            params.push(["UserId.1", name]);
        }
        ec2_httpclient.queryEC2("ModifyImageAttribute", params, this, true, "onCompleteModifyImageAttribute", callback);
    },

    onCompleteModifyImageAttribute : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    resetLaunchPermissions : function (imageId, callback) {
        var params = []
        params.push(["ImageId", imageId]);
        params.push(["Attribute","launchPermission"]);
        ec2_httpclient.queryEC2("ResetImageAttribute", params, this, true, "onCompleteResetImageAttribute", callback);
    },

    onCompleteResetImageAttribute : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    firstChild : function (node) {
        return node == null ? "" : node.firstChild.nodeValue
    },

    unpackReservationInstances : function (resId, ownerId, instanceItems) {
        var list = new Array();

        for (var j = 0; j < instanceItems.length; j++) {
            if (instanceItems[j].nodeName == '#text') continue;

            var instanceId = getNodeValueByName(instanceItems[j], "instanceId");
            var imageId = getNodeValueByName(instanceItems[j], "imageId");

            var instanceState = instanceItems[j].getElementsByTagName("instanceState")[0];
            var stateName = getNodeValueByName(instanceState, "name");

            var dnsName = getNodeValueByName(instanceItems[j], "dnsName");
            var privateDnsName = getNodeValueByName(instanceItems[j], "privateDnsName");
            var privateIpAddress = getNodeValueByName(instanceItems[j], "privateIpAddress");
            var publicIpAddress = getNodeValueByName(instanceItems[j], "ipAddress");
            var vpcId = getNodeValueByName(instanceItems[j], "vpcId");
            var subnetId = getNodeValueByName(instanceItems[j], "subnetId");
            var keyName = getNodeValueByName(instanceItems[j], "keyName");
            var reason = getNodeValueByName(instanceItems[j], "reason");
            var amiLaunchIdx = getNodeValueByName(instanceItems[j], "amiLaunchIndex");
            var instanceType = getNodeValueByName(instanceItems[j], "instanceType");
            var launchTime = new Date();
            launchTime.setISO8601(getNodeValueByName(instanceItems[j], "launchTime"));

            var placementElem = instanceItems[j].getElementsByTagName("placement")[0];
            var availabilityZone = placementElem.getElementsByTagName("availabilityZone")[0].firstChild;
            var placement = {
                "availabilityZone" : availabilityZone != null ? availabilityZone.nodeValue : null
            };
            // This value might not exist, but getNodeValueByName
            // returns "" in case the element is not defined.
            var platform = getNodeValueByName(instanceItems[j], "platform");
            if (!isWindows(platform)) {
                var kernelId = getNodeValueByName(instanceItems[j], "kernelId");
                var ramdiskId = getNodeValueByName(instanceItems[j], "ramdiskId");
            }

            var rdt = getNodeValueByName(instanceItems[j], "rootDeviceType");

            var iamInstanceProfile = instanceItems[j].getElementsByTagName("iamInstanceProfile")[0];
            var iamInstanceProfileArn = iamInstanceProfile ? getNodeValueByName(iamInstanceProfile, "arn") : '';

            var ebsOptimized = getNodeValueByName(instanceItems[j], "ebsOptimized");

            var groups_h = new Object();
            var groupNames = instanceItems[j].getElementsByTagName("groupName");
            var gname = null
            var groups = []

            for (var k = 0; k < groupNames.length; k++) {
              if (groupNames[k].firstChild) {
                gname = groupNames[k].firstChild.nodeValue.toString().trim()
                if (gname) { groups_h[gname] = 1; }
              }
            }
            for (gname in groups_h) { groups.push(gname); }

          list.push(new Instance(resId,
                                   ownerId,
                                   groups,
                                   instanceId,
                                   imageId,
                                   kernelId || "",
                                   ramdiskId || "",
                                   stateName,
                                   dnsName,
                                   privateDnsName,
                                   privateIpAddress,
                                   publicIpAddress,
                                   keyName,
                                   reason,
                                   amiLaunchIdx,
                                   instanceType,
                                   launchTime,
                                   placement,
                                   platform,
                                   null,
                                   vpcId,
                                   subnetId,
                                   rdt,
                                   iamInstanceProfileArn,
                                   ebsOptimized));
        }

        return list;
    },

    runInstances : function (imageId, kernelId, ramdiskId, minCount, maxCount, keyName, securityGroups, userData, properties, ephemeral0, ephemeral1, ephemeral2, ephemeral3, instanceType, placement, subnetId, ipAddress, securityGroupIds, iamInstanceProfileArn, iamInstanceProfileName, ebsOptimized, assignPublicIp, rootDeviceSize, rootDeviceType, rootDeviceIops, callback) {
        var params = []
        params.push(["ImageId", imageId]);
        if (kernelId != null && kernelId != "") {
            params.push(["KernelId", kernelId]);
        }
        if (ramdiskId != null && ramdiskId != "") {
            params.push(["RamdiskId", ramdiskId]);
        }
        params.push(["InstanceType", instanceType]);
        params.push(["MinCount", minCount]);
        params.push(["MaxCount", maxCount]);
        if (keyName != null && keyName != "") {
            params.push(["KeyName", keyName]);
        }
        if (subnetId == null) {
          for(var i in securityGroups) {
              params.push(["SecurityGroup."+(i+1), securityGroups[i]]);
          }
          for(var i in securityGroupIds) {
              params.push(["SecurityGroupId."+(i+1), securityGroupIds[i]]);
          }
        }
        if (userData != null) {
            var b64str = "Base64:";
            if (userData.indexOf(b64str) != 0) {
                // This data needs to be encoded
                userData = Base64.encode(userData);
            } else {
                userData = userData.substring(b64str.length);
            }
            log(userData);
            params.push(["UserData", userData]);
        }
        if (properties != null) {
            params.push(["AdditionalInfo", properties]);
        }

        var deviceIndex = 0;

        rootDeviceSize = (rootDeviceSize || '').trim();
        rootDeviceType = (rootDeviceType || '').trim();

        if (rootDeviceSize || rootDeviceType) {
            params.push(["BlockDeviceMapping." + deviceIndex + ".DeviceName", '/dev/sda1']);

            if (rootDeviceSize) {
                params.push(["BlockDeviceMapping." + deviceIndex + ".Ebs.VolumeSize", rootDeviceSize]);
            }

            if (rootDeviceType) {
                params.push(["BlockDeviceMapping." + deviceIndex + ".Ebs.VolumeType", rootDeviceType]);


                if (rootDeviceType == 'io1') {
                    params.push(["BlockDeviceMapping." + deviceIndex + ".Ebs.Iops", rootDeviceIops]);
                }
            }

            deviceIndex++;
        }


        ephemeral0 = (ephemeral0 || '').trim();
        ephemeral1 = (ephemeral1 || '').trim();
        ephemeral2 = (ephemeral2 || '').trim();
        ephemeral3 = (ephemeral3 || '').trim();

        if (ephemeral0) {
          params.push(["BlockDeviceMapping." + deviceIndex + ".DeviceName", ephemeral0]);
          params.push(["BlockDeviceMapping." + deviceIndex + ".VirtualName", "ephemeral0"]);
          deviceIndex++;
        }
        if (ephemeral1) {
          params.push(["BlockDeviceMapping." + deviceIndex + ".DeviceName", ephemeral1]);
          params.push(["BlockDeviceMapping." + deviceIndex + ".VirtualName", "ephemeral1"]);
          deviceIndex++;
        }
        if (ephemeral2) {
          params.push(["BlockDeviceMapping." + deviceIndex + ".DeviceName", ephemeral2]);
          params.push(["BlockDeviceMapping." + deviceIndex + ".VirtualName", "ephemeral2"]);
          deviceIndex++;
        }
        if (ephemeral3) {
          params.push(["BlockDeviceMapping." + deviceIndex + ".DeviceName", ephemeral3]);
          params.push(["BlockDeviceMapping." + deviceIndex + ".VirtualName", "ephemeral3"]);
          deviceIndex++;
        }
        if (placement.availabilityZone != null && placement.availabilityZone != "") {
            params.push(["Placement.AvailabilityZone", placement.availabilityZone]);
        }
        if (subnetId != null) {
          params.push(["NetworkInterface.0.DeviceIndex", 0]);
          params.push(["NetworkInterface.0.SubnetId", subnetId]);

          for(var i in securityGroupIds) {
              params.push(["NetworkInterface.0.SecurityGroupId."+(i+1), securityGroupIds[i]]);
          }

          if (assignPublicIp) {
            params.push(["NetworkInterface.0.AssociatePublicIpAddress", assignPublicIp]);
          }

          if (ipAddress != null && ipAddress != "") {
            params.push(["NetworkInterface.0.PrivateIpAddress", ipAddress]);
          }
        }

        if (iamInstanceProfileArn) {
          params.push(["IamInstanceProfile.Arn", iamInstanceProfileArn]);
        }

        if (iamInstanceProfileName) {
          params.push(["IamInstanceProfile.Name", iamInstanceProfileName]);
        }

        if (ebsOptimized) {
          params.push(["EbsOptimized", ebsOptimized]);
        }

        ec2_httpclient.queryEC2("RunInstances", params, this, true, "onCompleteRunInstances", callback);
    },

    onCompleteRunInstances : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.evaluate("/",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var resId = getNodeValueByName(items.snapshotItem(i), "reservationId");
            var ownerId = getNodeValueByName(items.snapshotItem(i), "ownerId");

            var instancesSet = items.snapshotItem(i).getElementsByTagName("instancesSet")[0];
            var instanceItems = instancesSet.childNodes;

            if (instanceItems) {
                var resList = this.unpackReservationInstances(resId, ownerId, instanceItems);
                for (var j = 0; j < resList.length; j++) {
                    list.push(resList[j]);
                }
            }
        }

        if (objResponse.callback)
            objResponse.callback(list);
    },

    terminateInstances : function (instanceIds, callback) {
        var params = []
        for(var i in instanceIds) {
            params.push(["InstanceId."+(i+1), instanceIds[i]]);
        }
        ec2_httpclient.queryEC2("TerminateInstances", params, this, true, "onCompleteTerminateInstances", callback);
    },

    onCompleteTerminateInstances : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.evaluate("/",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var instancesSet = items.snapshotItem(i).getElementsByTagName("instancesSet")[0];
            var instanceItems = instancesSet.getElementsByTagName("item");
            for (var j = 0; j < instanceItems.length; j++) {
                var instanceId = getNodeValueByName(instanceItems[j], "instanceId");
                list.push({id:instanceId});
            }
        }

        if (objResponse.callback)
            objResponse.callback(list);
    },

    stopInstances : function (instanceIds, force, callback) {
        var params = []
        for(var i in instanceIds) {
            params.push(["InstanceId."+(i+1), instanceIds[i]]);
        }
        if (force == true) {
            params.push(["Force", "true"]);
        }
        ec2_httpclient.queryEC2("StopInstances", params, this, true, "onCompleteStopInstances", callback);
    },

    onCompleteStopInstances : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.evaluate("/",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var instancesSet = items.snapshotItem(i).getElementsByTagName("instancesSet")[0];
            var instanceItems = instancesSet.getElementsByTagName("item");
            for (var j = 0; j < instanceItems.length; j++) {
                var instanceId = getNodeValueByName(instanceItems[j], "instanceId");
                list.push({id:instanceId});
            }
        }

        if (objResponse.callback)
            objResponse.callback(list);
    },

    startInstances : function (instanceIds, callback) {
        var params = []
        for(var i in instanceIds) {
            params.push(["InstanceId."+(i+1), instanceIds[i]]);
        }
        ec2_httpclient.queryEC2("StartInstances", params, this, true, "onCompleteStartInstances", callback);
    },

    onCompleteStartInstances : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        log("onCompleteStartInstances invoked");
        var list = new Array();
        var items = xmlDoc.evaluate("/",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var instancesSet = items.snapshotItem(i).getElementsByTagName("instancesSet")[0];
            var instanceItems = instancesSet.getElementsByTagName("item");
            for (var j = 0; j < instanceItems.length; j++) {
                var instanceId = getNodeValueByName(instanceItems[j], "instanceId");
                list.push({id:instanceId});
            }
        }

        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeInstances : function (callback) {
        ec2_httpclient.queryEC2("DescribeInstances", [], this, true, "onCompleteDescribeInstances", callback);
    },

    onCompleteDescribeInstances : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var tags = new Object();
        var items = xmlDoc.evaluate("/ec2:DescribeInstancesResponse/ec2:reservationSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        for(var i=0 ; i < items.snapshotLength; i++) {
            var resId = getNodeValueByName(items.snapshotItem(i), "reservationId");
            var ownerId = getNodeValueByName(items.snapshotItem(i), "ownerId");

            var instancesSet = items.snapshotItem(i).getElementsByTagName("instancesSet")[0];
            var instanceItems = instancesSet.childNodes;

            if (instanceItems) {
                var resList = this.unpackReservationInstances(resId, ownerId, instanceItems);
                list = list.concat(resList);

                for (var j = 0; j < instanceItems.length; j++) {
                    var instanceItem = instanceItems[j];

                    if (instanceItem.nodeName == '#text') {
                        continue;
                    }

                    this.walkTagSet(instanceItem, "instanceId", tags);
                }
            }
        }

        this.addEC2Tag(list, "id", tags);
        ec2ui_model.updateInstances(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    walkTagSet : function(item, idName, tags) {
        var instanceId = getNodeValueByName(item, idName);
        var tagSet = item.getElementsByTagName("tagSet")[0];

        if (tagSet) {
            var tagSetItems = tagSet.getElementsByTagName("item");
            var tagArray = new Array();
            var nameTag = null;

            for (var i= 0; i < tagSetItems.length; i++) {
                var tagSetItem = tagSetItems[i];
                var tagSetItemKey = getNodeValueByName(tagSetItem, "key");
                var tagSetItemValue = getNodeValueByName(tagSetItem, "value");

                if (/[,"]/.test(tagSetItemValue)) {
                    tagSetItemValue = tagSetItemValue.replace(/"/g, '""');
                    tagSetItemValue = '"' + tagSetItemValue + '"';
                }

                var keyValue = tagSetItemKey + ":" + tagSetItemValue;

                if (tagSetItemKey == "Name") {
                    nameTag = keyValue;
                } else {
                    tagArray.push(keyValue);
                }
            }

            tagArray.sort();

            if (nameTag) {
                tagArray.unshift(nameTag);
            }

            tags[instanceId] = tagArray.join(", ");
        }
    },

    addResourceTags : function (list, resourceType, attribute) {
        if (!list || list.length == 0) {
            return;
        }

        var tags = ec2ui_session.getResourceTags(resourceType);

        if (!tags) {
            return;
        }

        var new_tags = ec2ui_prefs.getEmptyWrappedMap();
        var res = null;
        var tag = null;
        for (var i in list) {
            res = list[i];
            tag = tags.get(res[attribute]);
            if (tag && tag.length) {
                res.tag = unescape(tag);
                new_tags.put(res[attribute], escape(res.tag));
            }
        }
        // Now that we've built the new set of instance tags, persist them
        ec2ui_session.setResourceTags(resourceType, new_tags);
    },

    addEC2Tag : function (list, attribute, tags) {
        if (!list || list.length == 0) {
            return;
        }

        if (!tags) {
            return;
        }

        var res = null;
        var tag = null;
        for (var i in list) {
            res = list[i];
            tag = tags[res[attribute]];
            if (tag && tag.length) {
                res.tag = tag
                __addNameTagToModel__(tag, res);
            }
        }
    },

    retrieveBundleTaskFromResponse : function (item) {
       var instanceId = getNodeValueByName(item, "instanceId");
       var id = getNodeValueByName(item, "bundleId");
       var state = getNodeValueByName(item, "state");

       var startTime = new Date();
       startTime.setISO8601(getNodeValueByName(item, "startTime"));

       var updateTime = new Date();
       updateTime.setISO8601(getNodeValueByName(item, "updateTime"));

       var storage = item.getElementsByTagName("storage")[0];
       var s3bucket = getNodeValueByName(storage, "bucket");
       var s3prefix = getNodeValueByName(storage, "prefix");
       var error = item.getElementsByTagName("error")[0];
       var errorMsg = "";
       if (error) {
           errorMsg = getNodeValueByName(error, "message");
       }
       var progress = getNodeValueByName(item, "progress");
       if (progress.length > 0) {
           state += " " + progress;
       }

       return new BundleTask(id, instanceId, state, startTime, updateTime, s3bucket, s3prefix, errorMsg);
   },

    parseBundleInstanceResponse : function (xmlDoc) {
        var list = new Array();

        var items = xmlDoc.getElementsByTagName("bundleInstanceTask");
        for(var i=0; i < items.length; ++i) {
            list.push(this.retrieveBundleTaskFromResponse(items[i]));
        }

        return list;
    },

    parseDescribeBundleTasksResponse : function (xmlDoc) {
       var list = new Array();

       var items = xmlDoc.evaluate("/ec2:DescribeBundleTasksResponse/ec2:bundleInstanceTasksSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
       for(var i=0; i < items.snapshotLength; ++i) {
           list.push(this.retrieveBundleTaskFromResponse(items.snapshotItem(i)));
       }

       return list;
    },

    describeBundleTasks : function (callback) {
        ec2_httpclient.queryEC2("DescribeBundleTasks", [], this, true, "onCompleteDescribeBundleTasks", callback);
    },

    onCompleteDescribeBundleTasks : function (objResponse) {
       var list = this.parseDescribeBundleTasksResponse(objResponse.xmlDoc);

       ec2ui_model.updateBundleTasks(list);
       if (objResponse.callback) {
           objResponse.callback(list);
       }
    },

    // Returns either the US or EU S3 endpoint
    getS3URL : function(bucket, region) {
        var suffix = null;

        // If a region wasn't passed, get the ACL for an
        // object in the currently active region
        if (!region) {
            region = ec2ui_utils.determineRegionFromString(ec2ui_session.getActiveEndpoint().name);
        }

        if (region == "EU-WEST-1") {
            //suffix = ".s3-external-3.amazonaws.com";
            suffix = ".s3-eu-west-1.amazonaws.com";
        } else if (region == "US-WEST-1") {
            suffix = ".s3-us-west-1.amazonaws.com";
        } else if (region == "US-WEST-2") {
            suffix = ".s3-us-west-2.amazonaws.com";
        } else if (region == "AP-SOUTHEAST-1") {
            suffix = ".s3-ap-southeast-1.amazonaws.com";
        } else if (region == "AP-SOUTHEAST-2") {
            suffix = ".s3-ap-southeast-2.amazonaws.com";
        } else if (region == "AP-NORTHEAST-1") {
            suffix = ".s3-ap-northeast-1.amazonaws.com";
        } else if (region == "SA-EAST-1") {
            suffix = ".s3-sa-east-1.amazonaws.com";
        } else {
            suffix = ".s3.amazonaws.com";
        }
        return "https://" + bucket + suffix;
    },

    // Returns true/false based on whether the copy operation was initiated
    copyS3Key : function(srcB, key, dstB, destReg, callback, xmlhttp) {
        // 0 - FAILURE
        // 1 - SUCCESS
        // 2 - FILE_EXISTS
        var ret = fileCopyStatus.FAILURE;

        if (destReg == null ||
            destReg.length == 0 ||
            srcB == null ||
            srcB.length == 0) {
            return ret;
        }

        if (key == null ||
            key.length == 0 ||
            dstB == null ||
            dstB.length == 0) {
            return ret;
        }

        if (callback == undefined) {
            return ret;
        }

        var params = "/" + key;

        if (false) {
            // Check to see whether the key exists in the bucket already
            httpRsp = ec2_httpclient.makeS3HTTPRequest("HEAD",
                                                       "/" + dstB + params,
                                                       this.getS3URL(dstB, destReg) + params,
                                                       null,
                                                       xmlhttp);

            if (!httpRsp.hasErrors ||
                (httpRsp.hasErrors && (httpRsp.xmlhttp.status == 403))) {
                log("File exists, no need to copy it");
                ret = fileCopyStatus.FILE_EXISTS;
            }

            if (ret == fileCopyStatus.FILE_EXISTS) {
                sleep(10);
                return ret;
            }
        }

        // Need to copy this key from source to destination
        var msg = "Copying key: " + key;
        msg += " from Source: " + srcB + " to Dest: " + dstB;
        log(msg);

        var resp = ec2_httpclient.makeS3HTTPRequest(
            "PUT",
            "/" + dstB + params,
            this.getS3URL(dstB, destReg) + params,
            null,
            xmlhttp,
            "/" + srcB + params,
            true,
            "onCompleteCopyS3Key",
            this,
            callback
            );

        return !resp.hasErrors;
    },

    onCompleteCopyS3Key : function(objResponse) {
        var callback = objResponse.callback;
        if (callback) {
            callback(objResponse);
        }
    },

    // Returns the acl or ""
    getS3ACL : function(bucket, key, region) {
        if (bucket == null ||
            bucket.length == 0) {
            return null;
        }

        if (!key) {
            key = "";
        }

        log("Enumerating ACLs for Bucket: " + bucket);
        var params = "/" + key + "?acl";
        var httpRsp = ec2_httpclient.makeS3HTTPRequest(
            "GET",
            "/" + bucket + params,
            this.getS3URL(bucket, region) + params
            );

        if (!httpRsp.hasErrors) {
            var xmlhttp = httpRsp.xmlhttp;
            if (xmlhttp) {
                var doc = xmlhttp.responseXML;
                if (doc == null) {
                    doc = new DOMParser().parseFromString(xmlhttp.responseText,
                                                          "text/xml");
                }

                var serializer = new XMLSerializer();
                return serializer.serializeToString(doc.firstChild);
            }
        }

        return "";
    },

    // Returns true/false based on whether the acl could be set
    setS3ACL : function(bucket, key, region, acl, xmlhttp) {
        if (bucket == null ||
            bucket.length == 0) {
            return false;
        }

        if (!key) {
            key = "";
        }

        if (acl == null ||
            acl.length == 0) {
            return true;
        }

        log("Setting ACL on Key: " + key);
        var params = "/" + key + "?acl";
        var httpRsp = ec2_httpclient.makeS3HTTPRequest(
            "PUT",
            "/" + bucket + params,
            this.getS3URL(bucket, region) + params,
            acl,
            xmlhttp
            );

        return !httpRsp.hasErrors;
    },

    // Returns true or false
    writeS3KeyInBucket : function(bucket, key, content, region) {
        if (key == null ||
            key.length == 0 ||
            bucket == null ||
            bucket.length == 0) {
            return false;
        }

        var params = "/" + key;
        var httpRsp = ec2_httpclient.makeS3HTTPRequest(
            "PUT",
            "/" + bucket + params,
            this.getS3URL(bucket, region) + params,
            content
            );

        return !httpRsp.hasErrors;
    },

    // Returns true or false
    deleteS3KeyFromBucket : function(bucket, key, region) {
        if (key == null ||
            key.length == 0 ||
            bucket == null ||
            bucket.length == 0) {
            // return false;
        }

        var params = "/" + key;
        ec2_httpclient.makeS3HTTPRequest(
            "DELETE",
            "/" + bucket + params,
            this.getS3URL(bucket, region) + params
            );

        return true;
    },

    // Returns a list of parts or null
    getS3KeyListWithPrefixInBucket : function(prefix, bucket, region) {
        if (prefix == null ||
            prefix.length == 0 ||
            bucket == null ||
            bucket.length == 0) {
            return null;
        }

        log("Enumerating keys with prefix " + prefix + " in bucket " + bucket);
        var list = null;
        var params = "/?prefix=" + prefix;
        var httpRsp = ec2_httpclient.makeS3HTTPRequest(
            "GET",
            "/" + bucket + "/",
            this.getS3URL(bucket, region) + params
            );

        if (!httpRsp.hasErrors) {
            var respXML = new DOMParser().parseFromString(httpRsp.xmlhttp.responseText,
                                                          "text/xml");
            var items = respXML.getElementsByTagName("Contents");
            list = new Array(items.length);
            for (var i = 0; i < items.length; ++i) {
                list[i] = getNodeValueByName(items[i], "Key");
            }
            log("# Keys retrieved: " + list.length);
        }

        return list;
    },

    doesS3BucketExist : function(bucket, region) {
        var fileName = "/" + bucket + "/";
        var s3url = this.getS3URL(bucket, region) + "/?max-keys=0";
        var fSuccess = false;
        var httpRsp = ec2_httpclient.makeS3HTTPRequest("HEAD",
                                                       fileName,
                                                       s3url);

        if (httpRsp.hasErrors) {
            if (httpRsp.xmlhttp.status == 403) {
                // Forbidden to access this but the bucket does exist!
                log("Bucket exists");
                fSuccess = true;
            }
        } else {
            // No errors!
            fSuccess = true;
        }

        log("Bucket '" + bucket + "' exists?: " + fSuccess);
        return fSuccess;
    },

    // Returns the bucket location or null
    getS3BucketLocation : function(bucket) {
        var fExist = false;
        var reg = null;
        var mult = 1;
        for (var i = 0; i < 3; ++i) {
            if (this.doesS3BucketExist(bucket)) {
                fExist = true;
                break;
            }
            // Sleep before trying again
            sleep(1000 * mult);
        }

        if (fExist) {
            var httpRsp = null;

            mult = 1;
            for (i = 0; i < 3; ++i) {
                httpRsp = ec2_httpclient.makeS3HTTPRequest("GET",
                    "/" + bucket + "/?location",
                    this.getS3URL(bucket) + "/?location");

                if (!httpRsp.hasErrors) {
                    var respXML = httpRsp.xmlhttp.responseXML;
                    if (respXML) {
                        var loc = getNodeValueByName(respXML, "LocationConstraint") || "";
                        if (loc.length == 0) {
                            loc = "US-EAST-1";
                        }
                        reg = ec2ui_utils.determineRegionFromString(loc);
                    }
                }
                // Sleep before trying again
                sleep(1000 * mult);
                mult += mult;
            }
        }

        return reg;
    },

    // Returns true/false based on whether the bucket could be created
    createS3Bucket : function(bucket, region) {
        var fileName = "/" + bucket + "/";
        if (!region) {
            region = ec2ui_utils.determineRegionFromString(ec2ui_session.getActiveEndpoint().name);
        }

        var s3url = this.getS3URL(bucket, region);
        var fSuccess = false;
        var httpRsp = null;
        var content = null;
        var respXML = null;

        // Check if the bucket already exists
        for (var i = 0; i < 2; ++i) {
            fSuccess = this.doesS3BucketExist(bucket, region);
            if (fSuccess) {
                break;
            }

            // Sleep a 100ms before trying again
            sleep(100);
        }

        // It doesn't exist, so create it
        if (!fSuccess) {
            if (region == "EU-WEST-1") {
                content = "<CreateBucketConstraint><LocationConstraint>EU</LocationConstraint></CreateBucketConstraint>";
            } else if (region == "US-WEST-1") {
                content = "<CreateBucketConstraint><LocationConstraint>us-west-1</LocationConstraint></CreateBucketConstraint>";
            } else if (region == "US-WEST-2") {
                content = "<CreateBucketConstraint><LocationConstraint>us-west-2</LocationConstraint></CreateBucketConstraint>";
            } else if (region == "AP-SOUTHEAST-1") {
                content = "<CreateBucketConstraint><LocationConstraint>ap-southeast-1</LocationConstraint></CreateBucketConstraint>";
            } else if (region == "AP-SOUTHEAST-2") {
                content = "<CreateBucketConstraint><LocationConstraint>ap-southeast-2</LocationConstraint></CreateBucketConstraint>";
            } else if (region == "AP-NORTHEAST-1") {
                content = "<CreateBucketConstraint><LocationConstraint>ap-northeast-1</LocationConstraint></CreateBucketConstraint>";
            }

            log(s3url + ": URL, Content: " + content || "");
            httpRsp = ec2_httpclient.makeS3HTTPRequest(
               "PUT",
               fileName,
               s3url,
               content
               );

            // The operation succeeded if there were no errors
            fSuccess = !httpRsp.hasErrors;
        }

        if (!fSuccess) {
            respXML = httpRsp.xmlhttp.responseXML;
            var errorMsg = getNodeValueByName(respXML, "Message");
            var errorCode = getNodeValueByName(respXML, "Code");
            alert ("Could not create S3 bucket. Error: " + errorCode + " - " + errorMsg);
            var toSign = getNodeValueByName(respXML, "StringToSignBytes");
            toSign = "0x" + toSign;
            toSign = toSign.replace(/\s/g, " 0x");
            toSign = toSign.split(" ");
            log(byteArrayToString(toSign));
        }

        return fSuccess;
    },

    bundleInstance : function (instanceId, bucket, prefix, activeCred, callback) {
        // Generate the S3 policy string using the bucket and prefix
        var s3policy = generateS3Policy(bucket, prefix);
        log("S3 Policy["+s3policy+"]");

        var s3polb64 = Base64.encode(s3policy);
        log("S3 Policy B64["+s3polb64+"]");

        // Sign the generated policy with the secret key
        var policySig = b64_hmac_sha1(activeCred.secretKey, s3polb64);
        log("S3 Policy Sig["+policySig+"]");

        var params = []
        params.push(["InstanceId", instanceId]);
        params.push(["Storage.S3.Bucket", bucket]);
        params.push(["Storage.S3.Prefix", prefix]);
        params.push(["Storage.S3.AWSAccessKeyId", activeCred.accessKey]);
        params.push(["Storage.S3.UploadPolicy", s3polb64]);
        params.push(["Storage.S3.UploadPolicySignature", policySig]);

        ec2_httpclient.queryEC2("BundleInstance", params, this, true, "onCompleteBundleInstance", callback);
    },

    onCompleteBundleInstance : function (objResponse) {
        // Parse the XML Response
        var list = this.parseBundleInstanceResponse(objResponse.xmlDoc);

        // Ensure that the UI knows to update its view
        if (objResponse.callback) {
            objResponse.callback(list);
        }
    },

    cancelBundleTask : function (id, callback) {
        var params = []
        params.push(["BundleId", id]);

        ec2_httpclient.queryEC2("CancelBundleTask", params, this, true, "onCompleteCancelBundleTask", callback);
    },

    onCompleteCancelBundleTask : function (objResponse) {
        // No need to parse the response since we only
        // need to refresh the list of bundle tasks.
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    describeKeypairs : function (callback) {
        ec2_httpclient.queryEC2("DescribeKeyPairs", [], this, true, "onCompleteDescribeKeypairs", callback);
    },

    onCompleteDescribeKeypairs : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++)
        {
            var name = getNodeValueByName(items[i], "keyName");
            var fp = getNodeValueByName(items[i], "keyFingerprint");
            list.push(new KeyPair(name, fp));
        }

        ec2ui_model.updateKeypairs(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeSecurityGroups : function (callback) {
        ec2_httpclient.queryEC2("DescribeSecurityGroups", [], this, true, "onCompleteDescribeSecurityGroups", callback);
    },

    onCompleteDescribeSecurityGroups : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.evaluate("/ec2:DescribeSecurityGroupsResponse/ec2:securityGroupInfo/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        var groupIdNames = {};

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var groupName = getNodeValueByName(items.snapshotItem(i), "groupName");
            var groupId = getNodeValueByName(items.snapshotItem(i), "groupId");
            groupIdNames[groupId] = groupName;
        }

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var ownerId = getNodeValueByName(items.snapshotItem(i), "ownerId");
            var groupName = getNodeValueByName(items.snapshotItem(i), "groupName");
            var groupDescription = getNodeValueByName(items.snapshotItem(i), "groupDescription");
            var vpcId = getNodeValueByName(items.snapshotItem(i), "vpcId");
            var groupId = getNodeValueByName(items.snapshotItem(i), "groupId");
            log("Group name ["+groupName+"]");

            var ipPermissionsList = new Array();
            var ipPermissions = items.snapshotItem(i).getElementsByTagName("ipPermissions")[0];
            var ipPermissionsItems = ipPermissions.childNodes;
            if (ipPermissionsItems) {
                for (var j = 0; j < ipPermissionsItems.length; j++) {
                    if (ipPermissionsItems.item(j).nodeName == '#text') continue;
                    var ipProtocol = getNodeValueByName(ipPermissionsItems.item(j), "ipProtocol");
                    var fromPort = getNodeValueByName(ipPermissionsItems.item(j), "fromPort");
                    var toPort = getNodeValueByName(ipPermissionsItems.item(j), "toPort");
                    log("Group ipp ["+ipProtocol+":"+fromPort+"-"+toPort+"]");

                    var groupTuples = new Array();
                    var groups = ipPermissionsItems[j].getElementsByTagName("groups")[0];
                    if (groups) {
                        var groupsItems = groups.childNodes;
                        for (var k = 0; k < groupsItems.length; k++) {
                            if (groupsItems.item(k).nodeName == '#text') continue;
                            var userId = getNodeValueByName(groupsItems[k], "userId");
                            var srcGroupName = getNodeValueByName(groupsItems[k], "groupName");

                            if (!srcGroupName) {
                                srcGroupName = groupIdNames[getNodeValueByName(groupsItems[k], "groupId")];
                            }

                            groupTuples.push([userId, srcGroupName]);
                            ipPermissionsList.push(new Permission(ipProtocol, fromPort, toPort, [[userId, srcGroupName]], []));
                        }
                    }

                    var cidrList = new Array();
                    var ipRanges = ipPermissionsItems[j].getElementsByTagName("ipRanges")[0];
                    if (ipRanges) {
                        var ipRangesItems = ipRanges.childNodes;
                        for (var k = 0; k < ipRangesItems.length; k++) {
                            if (ipRangesItems.item(k).nodeName == '#text') continue;
                            var cidrIp = getNodeValueByName(ipRangesItems[k], "cidrIp");
                            cidrList.push(cidrIp);
                            ipPermissionsList.push(new Permission(ipProtocol, fromPort, toPort, [], [cidrIp]));
                        }
                    }
                    //ipPermissionsList.push(new Permission(ipProtocol, fromPort, toPort, groupTuples, cidrList));
                }
            }

            list.push(new SecurityGroup(ownerId, groupName, groupDescription, ipPermissionsList, vpcId, groupId));
        }

        ec2ui_model.updateSecurityGroups(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    createKeypair : function (name, callback) {
        ec2_httpclient.queryEC2("CreateKeyPair", [["KeyName", name]], this, true, "onCompleteCreateKeyPair", callback);
    },

    onCompleteCreateKeyPair : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var name = getNodeValueByName(xmlDoc, "keyName");
        var fp = getNodeValueByName(xmlDoc, "keyFingerprint");
        var keyMaterial = getNodeValueByName(xmlDoc, "keyMaterial");

        // I'm lazy, so for now the caller will just have to call describeKeypairs again to see
        // the new keypair.

        if (objResponse.callback)
            objResponse.callback(name, keyMaterial);
    },

    deleteKeypair : function (name, callback) {
        ec2_httpclient.queryEC2("DeleteKeyPair", [["KeyName", name]], this, true, "onCompleteDeleteKeyPair", callback);
    },

    onCompleteDeleteKeyPair : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    createSecurityGroup : function (name, desc, vpcId, callback) {
        var params = [["GroupName", name], ["GroupDescription", desc]];

        if (vpcId) {
            params.push(["VpcId", vpcId]);
        }

        ec2_httpclient.queryEC2("CreateSecurityGroup", params, this, true, "onCompleteCreateSecurityGroup", callback);
    },

    onCompleteCreateSecurityGroup : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    deleteSecurityGroup : function (name, vpcId, callback) {
        var params = [];

        if (vpcId) {
            var groupId = ec2ui_model.getSecurityGroupIdFromName(name, vpcId);

            if (!groupId) {
                alert("Could not find group in VPC");
                return;
            }

            params.push(["GroupId", groupId]);
        } else {
            params.push(["GroupName", name]);
        }

        ec2_httpclient.queryEC2("DeleteSecurityGroup", params, this, true, "onCompleteDeleteSecurityGroup", callback);
    },

    onCompleteDeleteSecurityGroup : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    authorizeSourceCIDR : function (groupName, ipProtocol, fromPort, toPort, cidrIp, vpcId, callback) {
        var params = [];

        if (vpcId) {
            var groupId = ec2ui_model.getSecurityGroupIdFromName(groupName, vpcId);

            if (!groupId) {
                alert("Could not find group in VPC");
                return;
            }

            params.push(["GroupId", groupId]);
            params.push(["IpPermissions.1.IpProtocol", ipProtocol]);
            params.push(["IpPermissions.1.FromPort", fromPort]);
            params.push(["IpPermissions.1.ToPort", toPort]);
            params.push(["IpPermissions.1.IpRanges.1.CidrIp", cidrIp]);
        } else {
            params.push(["GroupName", groupName]);
            params.push(["IpProtocol", ipProtocol]);
            params.push(["FromPort", fromPort]);
            params.push(["ToPort", toPort]);
            params.push(["CidrIp", cidrIp]);
        }

        ec2_httpclient.queryEC2("AuthorizeSecurityGroupIngress", params, this, true, "onCompleteAuthorizeSecurityGroupIngress", callback);
    },

    authorizeSourceGroup : function (groupName, ipProtocol, fromPort, toPort, sourceSecurityGroupName, sourceSecurityGroupOwnerId, vpcId, callback) {
        var params = [];

        if (vpcId) {
            var groupId = ec2ui_model.getSecurityGroupIdFromName(groupName, vpcId);

            if (!groupId) {
                alert("Could not find group in VPC");
                return;
            }

            var srcGroupId = ec2ui_model.getSecurityGroupIdFromName(sourceSecurityGroupName, vpcId);

          if (!srcGroupId) {
                alert("Could not find source group in VPC");
                return;
            }

            params.push(["GroupId", groupId]);
            params.push(["IpPermissions.1.Groups.1.GroupId", srcGroupId]);
        } else {
            params.push(["GroupName", groupName]);
            params.push(["IpPermissions.1.Groups.1.GroupName", sourceSecurityGroupName]);
        }

        params.push(["IpPermissions.1.IpProtocol", ipProtocol]);
        params.push(["IpPermissions.1.FromPort", fromPort]);
        params.push(["IpPermissions.1.ToPort", toPort]);
        params.push(["IpPermissions.1.Groups.1.UserId", sourceSecurityGroupOwnerId]);
        ec2_httpclient.queryEC2("AuthorizeSecurityGroupIngress", params, this, true, "onCompleteAuthorizeSecurityGroupIngress", callback);
    },

    onCompleteAuthorizeSecurityGroupIngress : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    revokeSourceCIDR : function (groupName, ipProtocol, fromPort, toPort, cidrIp, vpcId, callback) {
        var params = [];


        if (vpcId) {
            var groupId = ec2ui_model.getSecurityGroupIdFromName(groupName, vpcId);

            if (!groupId) {
                alert("Could not find group in VPC");
                return;
            }

            params.push(["GroupId", groupId]);
            params.push(["IpPermissions.1.IpProtocol", ipProtocol]);
            params.push(["IpPermissions.1.FromPort", fromPort]);
            params.push(["IpPermissions.1.ToPort", toPort]);
            params.push(["IpPermissions.1.IpRanges.1.CidrIp", cidrIp]);
        } else {
            params.push(["GroupName", groupName]);
            params.push(["IpProtocol", ipProtocol]);
            params.push(["FromPort", fromPort]);
            params.push(["ToPort", toPort]);
            params.push(["CidrIp", cidrIp]);
        }

        ec2_httpclient.queryEC2("RevokeSecurityGroupIngress", params, this, true, "onCompleteRevokeSecurityGroupIngress", callback);
    },

    revokeSourceGroup : function (groupName, ipProtocol, fromPort, toPort, sourceSecurityGroupName, sourceSecurityGroupOwnerId, vpcId, callback) {
        var params = [];

        if (vpcId) {
            var groupId = ec2ui_model.getSecurityGroupIdFromName(groupName, vpcId);

            if (!groupId) {
                alert("Could not find group in VPC");
                return;
            }

            var srcGroupId = ec2ui_model.getSecurityGroupIdFromName(sourceSecurityGroupName, vpcId);

          if (!srcGroupId) {
                alert("Could not find source group in VPC");
                return;
            }

            params.push(["GroupId", groupId]);
            params.push(["IpPermissions.1.Groups.1.GroupId", srcGroupId]);
        } else {
            params.push(["GroupName", groupName]);
            params.push(["IpPermissions.1.Groups.1.GroupName", sourceSecurityGroupName]);
        }

        params.push(["IpPermissions.1.IpProtocol", ipProtocol]);
        params.push(["IpPermissions.1.FromPort", fromPort]);
        params.push(["IpPermissions.1.ToPort", toPort]);
        params.push(["IpPermissions.1.Groups.1.UserId", sourceSecurityGroupOwnerId]);
        ec2_httpclient.queryEC2("RevokeSecurityGroupIngress", params, this, true, "onCompleteRevokeSecurityGroupIngress", callback);
    },

    onCompleteRevokeSecurityGroupIngress : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    rebootInstances : function (instanceIds, callback) {
        var params = []
        for(var i in instanceIds) {
            params.push(["InstanceId."+(i+1), instanceIds[i]]);
        }
        ec2_httpclient.queryEC2("RebootInstances", params, this, true, "onCompleteRebootInstances", callback);
    },

    onCompleteRebootInstances : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    getConsoleOutput : function (instanceId, callback) {
        return ec2_httpclient.queryEC2("GetConsoleOutput", [["InstanceId", instanceId]], this, true, "onCompleteGetConsoleOutput", callback);
    },

    onCompleteGetConsoleOutput : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var instanceId = getNodeValueByName(xmlDoc, "instanceId");
        var timestamp = getNodeValueByName(xmlDoc, "timestamp");
        var output = xmlDoc.getElementsByTagName("output")[0];
        if (output.textContent) {
            output = Base64.decode(output.textContent);
            output = output.replace(/\x1b/mg, "\n").replace(/\r/mg, "").replace(/\n+/mg, "\n");
            //output = output.replace(/\n+/mg, "\n")
        } else {
            output = "";
        }

        if (objResponse.callback)
            objResponse.callback(instanceId, timestamp, output);
        return output;
    },

    describeAvailabilityZones : function (callback) {
        ec2_httpclient.queryEC2("DescribeAvailabilityZones", [], this, true, "onCompleteDescribeAvailabilityZones", callback);
    },

    onCompleteDescribeAvailabilityZones : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++)
        {
            var name = getNodeValueByName(items[i], "zoneName");
            var state = getNodeValueByName(items[i], "zoneState");
            list.push(new AvailabilityZone(name, state));
        }

        ec2ui_model.updateAvailabilityZones(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeAddresses : function (callback) {
        ec2_httpclient.queryEC2("DescribeAddresses", [], this, true, "onCompleteDescribeAddresses", callback);
    },

    onCompleteDescribeAddresses : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var list = new Array();
        var items = xmlDoc.getElementsByTagName("item");
        for (var i = 0; i < items.length; i++)
        {
            var publicIp = getNodeValueByName(items[i], "publicIp");
            var instanceid = getNodeValueByName(items[i], "instanceId");
            var domain = getNodeValueByName(items[i], "domain");
            var allocationId = getNodeValueByName(items[i], "allocationId");
            var associationId = getNodeValueByName(items[i], "associationId");
            var networkInterfaceId = getNodeValueByName(items[i], "networkInterfaceId");
            list.push(new AddressMapping(publicIp, instanceid, domain, allocationId, associationId, networkInterfaceId));
        }

        this.addResourceTags(list, ec2ui_session.model.resourceMap.eips, "address");
        ec2ui_model.updateAddresses(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    allocateAddress : function (vpc, callback) {
        var params = [];

        if (vpc) {
            params.push(['Domain', 'vpc']);
        }

        ec2_httpclient.queryEC2("AllocateAddress", params, this, true, "onCompleteAllocateAddress", callback);
    },

    onCompleteAllocateAddress : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var address = getNodeValueByName(xmlDoc, "publicIp");

        if (objResponse.callback)
            objResponse.callback(address);
    },

    releaseAddress : function (address, allocationId, callback) {
        var params = [];

        if (allocationId) {
            params.push(['AllocationId', allocationId]);
        } else {
            params.push(['PublicIp', address]);
        }

        ec2_httpclient.queryEC2("ReleaseAddress", params, this, true, "onCompleteReleaseAddress", callback);
    },

    onCompleteReleaseAddress : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    associateAddress : function (address, instanceid, allocationId, callback) {
        var params = [['InstanceId', instanceid]];

        if (allocationId) {
            params.push(['AllocationId', allocationId]);
        } else {
            params.push(['PublicIp', address]);
        }

        ec2_httpclient.queryEC2("AssociateAddress", params, this, true, "onCompleteAssociateAddress", callback);
    },

    associateAddressWithENI : function (address, eni_id, allocationId, callback) {
        var params = [['NetworkInterfaceId', eni_id]];

        if (allocationId) {
            params.push(['AllocationId', allocationId]);
        } else {
            params.push(['PublicIp', address]);
        }

        ec2_httpclient.queryEC2("AssociateAddress", params, this, true, "onCompleteAssociateAddress", callback);
    },

    onCompleteAssociateAddress : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    disassociateAddress : function (address, associationId, callback) {
        var params = [];

        if (associationId) {
            params.push(['AssociationId', associationId]);
        } else {
            params.push(['PublicIp', address]);
        }

        ec2_httpclient.queryEC2("DisassociateAddress", params, this, true, "onCompleteDisassociateAddress", callback);
    },

    onCompleteDisassociateAddress : function (objResponse) {
        if (objResponse.callback)
            objResponse.callback();
    },

    describeRegions : function (callback) {
        ec2_httpclient.queryEC2("DescribeRegions", [], this, true, "onCompleteDescribeRegions", callback);
    },

    onCompleteDescribeRegions : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeRegionsResponse/ec2:regionInfo/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);
        var endPointMap = new Object();
        for (var i = 0; i < items.snapshotLength; ++i)
        {
            var name = getNodeValueByName(items.snapshotItem(i), "regionName");
            var url = getNodeValueByName(items.snapshotItem(i), "regionEndpoint");
            if (url.indexOf("https://") != 0) {
                url = "https://" + url;
            }
            endPointMap[name] = new Endpoint(name, url);
            log("name: " + name + ", url: " + url);
        }

        if (objResponse.callback) {
            objResponse.callback(endPointMap);
        }
    },

    onResponseComplete : function (responseObject) {
        // For async requests, we should always call back
        if (!responseObject.isAsync &&
            responseObject.hasErrors) {
            return;
        }

        eval("this."+responseObject.requestType+"(responseObject)");
    },

    describeLoadBalancers : function (callback) {
        ec2_httpclient.queryELB("DescribeLoadBalancers", [], this, true, "onCompleteDescribeLoadBalancers", callback);
    },

    onCompleteDescribeLoadBalancers : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.getElementsByTagName("member");
        for (var i = 0; i < items.length; i++)
        {
	    var LoadBalancerName = getNodeValueByName(items[i], "LoadBalancerName");
            var CreatedTime = getNodeValueByName(items[i], "CreatedTime");
            var DNSName = getNodeValueByName(items[i], "DNSName");
	    var Instances = new Array();
            var InstanceId = items[i].getElementsByTagName("InstanceId");
            for (var j = 0; j < InstanceId.length; j++) {
		Instances.push(InstanceId[j].firstChild.nodeValue);
            }

	    var listener = items[i].getElementsByTagName("ListenerDescriptions");
            for (var k = 0; k < listener.length; k++)
            {
                var Protocol = getNodeValueByName(listener[k], "Protocol");
                var LoadBalancerPort = getNodeValueByName(listener[k], "LoadBalancerPort");
                var InstancePort = getNodeValueByName(listener[k], "InstancePort");
            }

            var HealthCheck = items[i].getElementsByTagName("HealthCheck");
            for (var k = 0; k < HealthCheck.length; k++)
            {
                var Interval = getNodeValueByName(HealthCheck[k], "Interval");
                var Timeout = getNodeValueByName(HealthCheck[k], "Timeout");
                var HealthyThreshold = getNodeValueByName(HealthCheck[k], "HealthyThreshold");
                var UnhealthyThreshold = getNodeValueByName(HealthCheck[k], "UnhealthyThreshold");
                var Target = getNodeValueByName(HealthCheck[k], "Target");
            }

	    var azone = new Array();
            var AvailabilityZones = items[i].getElementsByTagName("AvailabilityZones");
            for (var k = 0; k < AvailabilityZones.length; k++)
            {
	        var zone = AvailabilityZones[k].getElementsByTagName("member");
		for (var j = 0; j < zone.length; j++) {
		    azone.push(zone[j].firstChild.nodeValue);
		}
	    }

	    var AppCookieStickinessPolicies = items[i].getElementsByTagName("AppCookieStickinessPolicies");
	    for(var k = 0; k < AppCookieStickinessPolicies.length; k++){
		var CookieName = getNodeValueByName(AppCookieStickinessPolicies[k], "CookieName");
		var APolicyName = getNodeValueByName(AppCookieStickinessPolicies[k], "PolicyName");
	    }

	    var LBCookieStickinessPolicies = items[i].getElementsByTagName("LBCookieStickinessPolicies");
	    for(var k = 0; k < LBCookieStickinessPolicies.length; k++){
		var CookieExpirationPeriod = getNodeValueByName(LBCookieStickinessPolicies[k], "CookieExpirationPeriod");
		var CPolicyName = getNodeValueByName(LBCookieStickinessPolicies[k], "PolicyName");
	    }

        var securityGroups = items[i].getElementsByTagName("SecurityGroups");
        var groupList = [];

        if (securityGroups[0] && securityGroups[0].childNodes.length > 0) {
            var securityGroupMembers = securityGroups[0].getElementsByTagName("member");

            for (var k = 0; k < securityGroupMembers.length; k++) {
                groupList.push(securityGroupMembers[k].firstChild.nodeValue);
            }
        }

        var vpcId = getNodeValueByName(items[i], "VPCId");

        var groupNames = null;

        if (vpcId) {
            groupNames = [];
            var groupIdNames = ec2ui_model.getSecurityGroupIdNames(vpcId);

            for(var k = 0; k < groupList.length; k++) {
                var groupName = groupIdNames[groupList[k]];
                groupNames.push(groupName || groupList[k]);
            }
        }

        var subnets = items[i].getElementsByTagName("Subnets");
        var subnetList = [];

        if (subnets[0] && subnets[0].childNodes.length > 0) {
            var subnetMembers = subnets[0].getElementsByTagName("member");

            for (var k = 0; k < subnetMembers.length; k++) {
                subnetList.push(subnetMembers[k].firstChild.nodeValue);
            }
        }

	    if (LoadBalancerName != '' && CreatedTime != '')
            {
            list.push(new LoadBalancer(LoadBalancerName,CreatedTime, DNSName,
				       Instances,Protocol,LoadBalancerPort,InstancePort,
				       Interval,Timeout,
				       HealthyThreshold,
				       UnhealthyThreshold,
				       Target,azone,
				       CookieName,APolicyName,
				       CookieExpirationPeriod,CPolicyName,
                       vpcId,
                       subnetList,
                       (groupNames || groupList)));
            }
        }
        ec2ui_model.updateLoadbalancer(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    describeInstanceHealth : function(LoadBalancerName,callback) {
	params = []
        params.push(["LoadBalancerName", LoadBalancerName]);

        ec2_httpclient.queryELB("DescribeInstanceHealth", params, this, true, "oncompletedescribeInstanceHealth", callback);
    },

    oncompletedescribeInstanceHealth : function(objResponse) {
	var xmlDoc = objResponse.xmlDoc;
        var list = new Array();
        var items = xmlDoc.getElementsByTagName("member");
        for (var i = 0; i < items.length; i++)
        {
            var Description = getNodeValueByName(items[i], "Description");
            var State = getNodeValueByName(items[i], "State");
            var InstanceId = getNodeValueByName(items[i], "InstanceId");
	    var ReasonCode = getNodeValueByName(items[i], "ReasonCode");

	    list.push(new InstanceHealth(Description,State, InstanceId,ReasonCode));
        }

        ec2ui_model.updateInstanceHealth(list);
        if (objResponse.callback)
            objResponse.callback(list);
    },

    deleteLoadBalancer : function(LoadBalancerName,callback) {
       params = []
       params.push(["LoadBalancerName", LoadBalancerName]);

       ec2_httpclient.queryELB("DeleteLoadBalancer", params, this, true, "oncompleteDeleteLoadBalancer", callback);
    },

    oncompleteDeleteLoadBalancer : function(objResponse) {
	var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    CreateLoadBalancer : function (LoadBalancerName,Protocol,elbport,instanceport,Zone,subnet,groups,callback) {
	var params = []
	params.push(["LoadBalancerName", LoadBalancerName]);

      if (Zone) {
        params.push(["AvailabilityZones.member.1", Zone]);
      } else {
        params.push(["Subnets.member.1", subnet]);

        for (var i = 0; i < groups.length; i++) {
          params.push(["SecurityGroups.member." + (i + 1), groups[i]]);
        }
      }

	params.push(["Listeners.member.Protocol", Protocol]);
	if (Protocol == "HTTPS")
	{
	    params.push(["Listeners.member.SSLCertificateId", "arn:aws:iam::322191361670:server-certificate/testCert"]);
	}
	params.push(["Listeners.member.LoadBalancerPort", elbport]);
	params.push(["Listeners.member.InstancePort", instanceport]);
	ec2_httpclient.queryELB("CreateLoadBalancer", params, this, true, "onCompleteCreateLoadBalancer", callback);
    },

    onCompleteCreateLoadBalancer: function (objResponse) {
	var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    ConfigureHealthCheck : function(LoadBalancerName,pingprotocol,pingport,pingpath,Interval,Timeout,HealthyThreshold,UnhealthyThreshold,callback){
       var params = []
       if (pingprotocol != null) {
           if (pingprotocol == 'HTTP') {
               params.push(["HealthCheck.Target" , pingprotocol+":"+pingport+"/"+pingpath]);
           } else {
               params.push(["HealthCheck.Target" , pingprotocol+":"+pingport]);
           }
       }
       if (LoadBalancerName != null) params.push(["LoadBalancerName", LoadBalancerName]);
       if (Interval != null) params.push(["HealthCheck.Interval", Interval]);
       if (Timeout != null) params.push(["HealthCheck.Timeout", Timeout]);
       if (HealthyThreshold != null) params.push(["HealthCheck.HealthyThreshold", HealthyThreshold]);
       if (UnhealthyThreshold != null) params.push(["HealthCheck.UnhealthyThreshold", UnhealthyThreshold]);

       ec2_httpclient.queryELB("ConfigureHealthCheck", params, this, true, "onCompleteConfigureHealthCheck", callback);
    },

    onCompleteConfigureHealthCheck : function(objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "HealthCheck");
        if (objResponse.callback)
            objResponse.callback(items);

    },

    RegisterInstancesWithLoadBalancer : function (LoadBalancerName,RegInstance,callback) {
	params = []
	params.push(["LoadBalancerName", LoadBalancerName]);
        params.push(["Instances.member.InstanceId", RegInstance]);
	ec2_httpclient.queryELB("RegisterInstancesWithLoadBalancer", params, this, true, "onCompleteRegisterInstancesWithLoadBalancer", callback);
    },

    onCompleteRegisterInstancesWithLoadBalancer: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    DeregisterInstancesWithLoadBalancer : function (LoadBalancerName,RegInstance,callback) {
	params = []
	params.push(["LoadBalancerName", LoadBalancerName]);
        params.push(["Instances.member.InstanceId", RegInstance]);

	ec2_httpclient.queryELB("DeregisterInstancesFromLoadBalancer", params, this, true, "onCompleteDeregisterInstancesWithLoadBalancer", callback);
    },

    onCompleteDeregisterInstancesWithLoadBalancer : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    Enableazonewithloadbalancer : function(LoadBalancerName,Zone,callback){
	params = []
	params.push(["LoadBalancerName", LoadBalancerName]);
        params.push(["AvailabilityZones.member.1", Zone]);

	ec2_httpclient.queryELB("EnableAvailabilityZonesForLoadBalancer", params, this, true, "onCompleteenableazonewithloadbalancer", callback);
    },

    onCompleteenableazonewithloadbalancer: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },


    Disableazonewithloadbalancer : function(LoadBalancerName,Zone,callback) {
	params = []
	params.push(["LoadBalancerName", LoadBalancerName]);
        params.push(["AvailabilityZones.member.1", Zone]);

	ec2_httpclient.queryELB("DisableAvailabilityZonesForLoadBalancer", params, this, true, "onCompletedisableazonewithloadbalancer", callback);
    },

    onCompletedisableazonewithloadbalancer: function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },


    EditHealthCheck : function(LoadBalancerName,Target,Interval,Timeout,HealthyThreshold,UnhealthyThreshold,callback) {
	var params = []
	params.push(["HealthCheck.Target" , Target]);
	params.push(["LoadBalancerName", LoadBalancerName]);
	params.push(["HealthCheck.Interval", Interval]);
	params.push(["HealthCheck.Timeout", Timeout]);
	params.push(["HealthCheck.HealthyThreshold", HealthyThreshold]);
	params.push(["HealthCheck.UnhealthyThreshold", UnhealthyThreshold]);

	ec2_httpclient.queryELB("ConfigureHealthCheck", params, this, true, "onCompleteEditHealthCheck", callback);
    },

    onCompleteEditHealthCheck : function(objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "HealthCheck");
        if (objResponse.callback)
            objResponse.callback(items);

    },

    CreateAppCookieSP : function(LoadBalancerName,CookieName,callback) {
       var uniqueid = new Date;
       var id = uniqueid.getTime();

       var PolicyName = "AWSConsolePolicy-"+ id;
       params = []
       params.push(["LoadBalancerName", LoadBalancerName]);
       params.push(["CookieName", CookieName]);
       params.push(["PolicyName", PolicyName]);
       ec2_httpclient.queryELB("CreateAppCookieStickinessPolicy", params, this, true, "oncompleteCreateAppCookieSP", callback);
       //no = no + 1;
    },

    oncompleteCreateAppCookieSP : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    CreateLBCookieSP : function(LoadBalancerName,CookieExpirationPeriod,callback)
    {
       var uniqueid = new Date;
       var id = uniqueid.getTime();

       var PolicyName = "AWSConsolePolicy-"+ id;
       params = []
       params.push(["CookieExpirationPeriod", CookieExpirationPeriod]);
       params.push(["LoadBalancerName", LoadBalancerName]);
       params.push(["PolicyName", PolicyName]);
       ec2_httpclient.queryELB("CreateLBCookieStickinessPolicy", params, this, true, "oncompleteCreateLBCookieSP", callback);
    },

    oncompleteCreateLBCookieSP : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    DeleteLoadBalancerPolicy : function(LoadBalancerName,policy,callback)
    {
       params = []
       params.push(["LoadBalancerName", LoadBalancerName]);

       params.push(["PolicyName", policy]);
       ec2_httpclient.queryELB("DeleteLoadBalancerPolicy", params, this, true, "oncompleteDeleteLoadBalancerPolicy", callback);
    },

    oncompleteDeleteLoadBalancerPolicy : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "member");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    uploadservercertificate : function(ServerCertificateName,CertificateBody,PrivateKey,Path,callback){
       params = []
       params.push(["ServerCertificateName", ServerCertificateName]);
       params.push(["CertificateBody", CertificateBody]);
       params.push(["PrivateKey", PrivateKey]);
       if (Path != null) params.push(["Path", Path]);
       ec2_httpclient.queryIAM("UploadServerCertificate", params, this, true, "oncompleteuploadserversertificate", callback);
    },

    oncompleteuploadservercertificate :function(objResponse){
        var xmlDoc = objResponse.xmlDoc;
        var items = getNodeValueByName(xmlDoc, "ServerCertificateMetadata");
        if (objResponse.callback)
            objResponse.callback(items);
    },

    createTags : function (resIds, tags, callback) {
        var params = new Array();

        for (var i = 0; i < resIds.length; i++) {
            var tagKey = tags[i][0];

            if (/^aws:/.test(tagKey)) {
                continue;
            }

            params.push(["ResourceId." + (i + 1)   , resIds[i]]);
            params.push(["Tag." + (i + 1) + ".Key"  , tagKey]);
            params.push(["Tag." + (i + 1) + ".Value", tags[i][1]]);
        }

        ec2_httpclient.queryEC2("CreateTags", params, this, true, "onCompleteCreateTags", callback);
    },

    onCompleteCreateTags : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    deleteTags : function (resIds, keys, callback) {
        var params = new Array();

        for (var i = 0; i < resIds.length; i++) {
            var tagKey = keys[i];

            if (/^aws:/.test(tagKey)) {
                continue;
            }

            params.push(["ResourceId." + (i + 1), resIds[i]]);
            params.push(["Tag." + (i + 1) + ".Key", tagKey]);
        }

        ec2_httpclient.queryEC2("DeleteTags", params, this, true, "onCompleteDeleteTags", callback);
    },

    onCompleteDeleteTags : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    describeTags : function (resIds, callback) {
        var params = new Array();

        for (var i = 0; i < resIds.length; i++) {
            params.push(["Filter." + (i + 1) + ".Name", "resource-id"]);
            params.push(["Filter." + (i + 1) + ".Value.1", resIds[i]]);
        }

        ec2_httpclient.queryEC2("DescribeTags", params, this, true, "onCompleteDescribeTags", callback);
    },

    onCompleteDescribeTags : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = xmlDoc.evaluate("/ec2:DescribeTagsResponse/ec2:tagSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var tags = new Array();

        for (var i = 0; i < items.snapshotLength; ++i) {
            var resid = getNodeValueByName(items.snapshotItem(i), "resourceId");
            var key = getNodeValueByName(items.snapshotItem(i), "key");
            var value = getNodeValueByName(items.snapshotItem(i), "value");
            tags.push([resid, key, value]);
        }

        if (objResponse.callback) {
            objResponse.callback(tags);
        }
    },

    describeInstanceAttribute : function (instanceId, attribute, callback) {
        var params = new Array();
        params.push(["InstanceId", instanceId]);
        params.push(["Attribute", attribute]);
        ec2_httpclient.queryEC2("DescribeInstanceAttribute", params, this, true, "onCompleteDescribeInstanceAttribute", callback);
    },

    onCompleteDescribeInstanceAttribute : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = xmlDoc.evaluate("/ec2:DescribeInstanceAttributeResponse/*",
                                       xmlDoc,
                                       this.getNsResolver(),
                                       XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                       null);

        var value = getNodeValueByName(items.snapshotItem(2), "value");

        if (objResponse.callback) {
            objResponse.callback(value);
        }
    },

    describeVolumeAttribute : function (volumeId, attribute, callback) {
        var params = new Array();
        params.push(["VolumeId", volumeId]);
        params.push(["Attribute", attribute]);
        ec2_httpclient.queryEC2("DescribeVolumeAttribute", params, this, true, "onCompleteDescribeVolumeAttribute", callback);
    },

    onCompleteDescribeVolumeAttribute : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;
        var items = xmlDoc.evaluate("/ec2:DescribeVolumeAttributeResponse/*",
                                       xmlDoc,
                                       this.getNsResolver(),
                                       XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                       null);

        var value = getNodeValueByName(items.snapshotItem(2), "value");

        if (objResponse.callback) {
            objResponse.callback(value);
        }
    },

    modifyVolumeAttribute : function (volumeId, attribute, callback) {
        var params = new Array();
        var name = attribute[0];
        var value = attribute[1];

        params.push(["VolumeId", volumeId]);
        params.push([name + ".Value", value]);

        ec2_httpclient.queryEC2("ModifyVolumeAttribute", params, this, true, "onCompleteModifyVolumeAttribute", callback);
    },

    onCompleteModifyVolumeAttribute : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    modifyInstanceAttribute : function (instanceId, attribute, callback) {
        var params = new Array();
        var name = attribute[0];
        var value = attribute[1];

        params.push(["InstanceId", instanceId]);
        params.push([name + ".Value", value]);

        ec2_httpclient.queryEC2("ModifyInstanceAttribute", params, this, true, "onCompleteModifyInstanceAttribute", callback);
    },

    onCompleteModifyInstanceAttribute : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    modifyInstanceAttributes : function (instanceId, attributes, callback) {
        var params = new Array();
            params.push(["InstanceId", instanceId]);

        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var name = attr[0];
            var value = attr[1];
            params.push([name, value]);
        }

        ec2_httpclient.queryEC2("ModifyInstanceAttribute", params, this, true, "onCompleteModifyInstanceAttributes", callback);
    },

    onCompleteModifyInstanceAttributes : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    describeInstanceStatus : function (callback) {
        ec2_httpclient.queryEC2("DescribeInstanceStatus", [], this, true, "onCompleteDescribeInstanceStatus", callback);
    },

    onCompleteDescribeInstanceStatus : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeInstanceStatusResponse/ec2:instanceStatusSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var list = new Array();

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var item = items.snapshotItem(i);
            var eventsSet = item.getElementsByTagName("eventsSet")[0];

            if (!eventsSet) { continue; }

            var instanceId = getNodeValueByName(item, "instanceId");
            var availabilityZone = getNodeValueByName(item, "availabilityZone");
            var eventsSetItems = eventsSet.childNodes;

            for (var j = 0; j < eventsSetItems.length; j++) {
                var event = eventsSetItems[j];
                if (event.nodeName == '#text') continue;

                var code = getNodeValueByName(event, "code");
                var description = getNodeValueByName(event, "description");
                var startTime = getNodeValueByName(event, "notBefore");
                var endTime = getNodeValueByName(event, "notAfter");

                list.push(new InstanceStatusEvent(instanceId, availabilityZone, code, description, startTime, endTime));
            }
          }

        ec2ui_model.updateInstanceStatuses(list);

        if (objResponse.callback) {
            objResponse.callback(list);
        }
    },

    describeInstanceStatus2 : function (instanceIds, callback) {
        var params = new Array();
        params.push(["IncludeAllInstances", true]);

        for (var i = 0; i < instanceIds.length; i++) {
            params.push(["InstanceId." + i, instanceIds[i]]);
        }

        ec2_httpclient.queryEC2("DescribeInstanceStatus", params, this, true, "onCompleteDescribeInstanceStatus2", callback);
    },

    onCompleteDescribeInstanceStatus2 : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeInstanceStatusResponse/ec2:instanceStatusSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var list = new Array();

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var item = items.snapshotItem(i);

            var instanceId = getNodeValueByName(item, "instanceId");
            if (!instanceId) { continue; }

            var statuses = [instanceId, 'N/A', 'N/A'];

            var systemStatus = item.getElementsByTagName("systemStatus")[0];

            if (systemStatus) {
                var systemStatusStatus = getNodeValueByName(systemStatus, "status");
                if (systemStatusStatus) { statuses[1] = systemStatusStatus; }
            }

            var instanceStatus = item.getElementsByTagName("instanceStatus")[0];

            if (instanceStatus) {
                var instanceStatusStatus = getNodeValueByName(instanceStatus, "status");
                if (instanceStatusStatus) { statuses[2] = instanceStatusStatus; }
            }

            list.push(statuses);
        }

        if (objResponse.callback) {
            objResponse.callback(list);
        }
    },

    describeVolumeStatus : function (callback) {
        ec2_httpclient.queryEC2("DescribeVolumeStatus", [], this, true, "onCompleteDescribeVolumeStatus", callback);
    },

    onCompleteDescribeVolumeStatus : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeVolumeStatus/ec2:volumeStatusSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var list = new Array();

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var item = items.snapshotItem(i);
            var eventsSet = item.getElementsByTagName("eventsSet")[0];

            if (!eventsSet) { continue; }

            var volumeId = getNodeValueByName(item, "volumeId");
            var availabilityZone = getNodeValueByName(item, "availabilityZone");
            var eventsSetItems = eventsSet.childNodes;

            for (var j = 0; j < eventsSetItems.length; j++) {
                var event = eventsSetItems[j];
                if (event.nodeName == '#text') continue;

                var eventId = getNodeValueByName(event, "eventId");
                var eventType = getNodeValueByName(event, "eventType");
                var description = getNodeValueByName(event, "description");
                var startTime = getNodeValueByName(event, "notBefore");
                var endTime = getNodeValueByName(event, "notAfter");

                list.push(new VolumeStatusEvent(volumeId, availabilityZone, code, description, startTime, endTime));
            }
          }

        ec2ui_model.updateVolumeStatuses(list);

        if (objResponse.callback) {
            objResponse.callback(list);
        }
    },

    describeNetworkInterfaces : function (callback) {
        ec2_httpclient.queryEC2("DescribeNetworkInterfaces", [], this, true, "onCompleteDescribeNetworkInterfaces", callback);
    },

    onCompleteDescribeNetworkInterfaces : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeNetworkInterfacesResponse/ec2:networkInterfaceSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var list = new Array();

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var item = items.snapshotItem(i);

            var networkInterfaceId = getNodeValueByName(item, "networkInterfaceId");
            var subnetId = getNodeValueByName(item, "subnetId");
            var vpcId = getNodeValueByName(item, "vpcId");
            var availabilityZone = getNodeValueByName(item, "availabilityZone");
            var description = getNodeValueByName(item, "description");
            var ownerId = getNodeValueByName(item, "ownerId");
            var requesterManaged = getNodeValueByName(item, "requesterManaged");
            var status = getNodeValueByName(item, "status");
            var macAddress = getNodeValueByName(item, "macAddress");
            var privateIpAddress = getNodeValueByName(item, "privateIpAddress");
            var sourceDestCheck = getNodeValueByName(item, "sourceDestCheck");

            var groupList = [];
            var groupSet = item.getElementsByTagName('groupSet')[0];

            if (groupSet) {
                var groupSetItems = groupSet.getElementsByTagName('item');

                for (var j = 0; j < groupSetItems.length; j++) {
                    var groupName = getNodeValueByName(groupSetItems[j], 'groupName');

                    if (groupName) {
                        groupList.push(groupName);
                    }
                }
            }

            groupList.sort();

            var ipAddrList = [];
            var privateIpAddressesSet = item.getElementsByTagName('privateIpAddressesSet')[0];

            if (privateIpAddressesSet) {
                var privateIpAddressesSetItems = privateIpAddressesSet.getElementsByTagName('item');

                for (var j = 0; j < privateIpAddressesSetItems.length; j++) {
                    var ip_addr = getNodeValueByName(privateIpAddressesSetItems[j], "privateIpAddress");
                    var primary = getNodeValueByName(privateIpAddressesSetItems[j], "primary");

                    if (primary != "true") {
                        ipAddrList.push(ip_addr);
                    }
                }
            }

            ipAddrList.sort();

            var attachmentId = null;
            var instanceId = null;
            var deviceIndex = null;
            var attachment = item.getElementsByTagName('attachment')[0];

            if (attachment) {
                attachmentId = getNodeValueByName(attachment, 'attachmentId');
                instanceId = getNodeValueByName(attachment, 'instanceId');
                deviceIndex = getNodeValueByName(attachment, 'deviceIndex');
            }

            list.push(new NetworkInterface(networkInterfaceId, subnetId, vpcId, availabilityZone, description,
                                           ownerId, requesterManaged, status, macAddress, privateIpAddress, sourceDestCheck,
                                           groupList, attachmentId, instanceId, deviceIndex, ipAddrList));

        }

        ec2ui_model.updateNetworkInterfaces(list);

        if (objResponse.callback) {
            objResponse.callback(list);
        }
    },

    describePrivateIpAddresses : function (eni_id, callback) {
        var params = [
          ['Filter.1.Name', 'network-interface-id'],
          ['Filter.1.Value', eni_id]
        ];

        ec2_httpclient.queryEC2("DescribeNetworkInterfaces", params, this, true, "onCompleteDescribePrivateIpAddresses", callback);
    },

    onCompleteDescribePrivateIpAddresses : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var items = xmlDoc.evaluate("/ec2:DescribeNetworkInterfacesResponse/ec2:networkInterfaceSet/ec2:item/ec2:privateIpAddressesSet/ec2:item",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var list = new Array();

        for(var i = 0 ; i < items.snapshotLength; i++) {
            var item = items.snapshotItem(i);

            var privateIpAddress = getNodeValueByName(item, "privateIpAddress");
            var primary = getNodeValueByName(item, "primary");
            list.push([privateIpAddress, primary]);
        }

        if (objResponse.callback) {
            objResponse.callback(list);
        }
    },

    createNetworkInterface : function (vpcId, subnetId, privateIpAddress, description, groupNames, callback) {
        var params = [['SubnetId', subnetId]];

        if (privateIpAddress) {
            params.push(['PrivateIpAddress', privateIpAddress]);
        }

        if (description) {
            params.push(['Description', description]);
        }

        var groupNameIds =  ec2ui_model.getSecurityGroupNameIds(vpcId);

        for(var i = 0; i < groupNames.length; i++) {
            var name = groupNames[i];
            var groupId = groupNameIds[name];
            if (!groupId) { continue; }
            params.push(["SecurityGroupId."+(i+1), groupId]);
        }

        ec2_httpclient.queryEC2("CreateNetworkInterface", params, this, true, "onCompleteCreateNetworkInterface", callback);
    },

    onCompleteCreateNetworkInterface : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    deleteNetworkInterface : function (networkInterfaceId, callback) {
        var params = [['NetworkInterfaceId', networkInterfaceId]];
        ec2_httpclient.queryEC2("DeleteNetworkInterface", params, this, true, "onCompleteDeleteNetworkInterface", callback);
    },

    onCompleteDeleteNetworkInterface : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    modifyNetworkInterfaceAttribute : function (networkInterfaceId, attribute, callback) {
        var params = [];
        params.push(["NetworkInterfaceId", networkInterfaceId]);

        var name = attribute[0];
        var value = attribute[1];
        params.push([name + ".Value", value]);

        ec2_httpclient.queryEC2("ModifyNetworkInterfaceAttribute", params, this, true, "onCompleteModifyNetworkInterfaceAttribute", callback);
    },

    onCompleteModifyNetworkInterfaceAttribute : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    modifyNetworkInterfaceAttributes : function (networkInterfaceId, attributes, callback) {
        var params = [];
        params.push(["NetworkInterfaceId", networkInterfaceId]);

        for (var i = 0; i < attributes.length; i++) {
            var name = attributes[i][0];
            var value = attributes[i][1];
            params.push([name, value]);
        }

        ec2_httpclient.queryEC2("ModifyNetworkInterfaceAttribute", params, this, true, "onCompleteModifyNetworkInterfaceAttributes", callback);
    },

    onCompleteModifyNetworkInterfaceAttributes : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    attachNetworkInterface : function (networkInterfaceId, instanceId, deviceIndex, callback) {
        var params = [
            ['NetworkInterfaceId', networkInterfaceId],
            ['InstanceId', instanceId],
            ['DeviceIndex', deviceIndex],
        ];

        ec2_httpclient.queryEC2("AttachNetworkInterface", params, this, true, "onCompleteAttachNetworkInterface", callback);
    },

    onCompleteAttachNetworkInterface : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    detachNetworkInterface : function (attachmentId, force, callback) {
        var params = [
            ['AttachmentId', attachmentId],
        ];

        if (force) {
            params.push(['Force', force]);
        }

        ec2_httpclient.queryEC2("DetachNetworkInterface", params, this, true, "onCompleteDetachNetworkInterface", callback);
    },

    onCompleteDetachNetworkInterface : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    enableVolumeIO : function (volumeId, callback) {
        var params = [
            ['VolumeId', volumeId],
        ];

        ec2_httpclient.queryEC2("EnableVolumeIO", params, this, true, "onCompleteEnableVolumeIO", callback);
    },

    onCompleteEnableVolumeIO : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    describeVolumeStatus2 : function (volumeId, callback) {
        var params = [
            ['VolumeId.1', volumeId],
        ];

        ec2_httpclient.queryEC2("DescribeVolumeStatus", params, this, true, "onCompleteDescribeVolumeStatus2", callback);
    },

    onCompleteDescribeVolumeStatus2 : function (objResponse) {
        var xmlDoc = objResponse.xmlDoc;

        var volumeStatus = xmlDoc.evaluate("/ec2:DescribeVolumeStatus/ec2:volumeStatusSet/ec2:item/ec2:volumeStatus",
                                    xmlDoc,
                                    this.getNsResolver(),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                    null);

        var status = 'normal';

        if (volumeStatus.snapshotLength > 0) {
            volumeStatus = volumeStatus.snapshotItem(0);
            status = getNodeValueByName(volumeStatus, 'status');
        }

        if (objResponse.callback) {
            objResponse.callback(status);
        }
    },

    applySecurityGroupsToLoadBalancer : function (loadBalancerName, groups, callback) {
        var params = [];
        params.push(["LoadBalancerName", loadBalancerName]);

        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            params.push(["SecurityGroups.member." + (i + 1), group]);
        }

        ec2_httpclient.queryELB("ApplySecurityGroupsToLoadBalancer", params, this, true, "onCompleteApplySecurityGroupsToLoadBalancer", callback);
    },

    onCompleteApplySecurityGroupsToLoadBalancer : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    assignPrivateIpAddresses : function(eni_id, ip_addrs, reassign, callback) {
        var params = [["NetworkInterfaceId", eni_id]];

        for (var i = 0; i < ip_addrs.length; i++) {
            var ip_addr = ip_addrs[i];
            params.push(["PrivateIpAddress." + (i + 1), ip_addr]);
        }

        if (reassign) {
            params.push(["AllowReassignment", "true"])
        }

        ec2_httpclient.queryEC2("AssignPrivateIpAddresses", params, this, true, "onCompleteAssignPrivateIpAddresses", callback);
    },

    onCompleteAssignPrivateIpAddresses : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

    unassignPrivateIpAddresses : function(eni_id, ip_addrs, callback) {
        var params = [["NetworkInterfaceId", eni_id]];

        for (var i = 0; i < ip_addrs.length; i++) {
            var ip_addr = ip_addrs[i];
            params.push(["PrivateIpAddress." + (i + 1), ip_addr]);
        }

        ec2_httpclient.queryEC2("UnassignPrivateIpAddresses", params, this, true, "onCompleteUnassignPrivateIpAddresses", callback);
    },

    onCompleteUnassignPrivateIpAddresses : function (objResponse) {
        if (objResponse.callback) {
            objResponse.callback();
        }
    },

};
