// On-Demand Instances
var __calcLinuxMonthlyAmount__rateSheets = {
  "us-east-1" : {
    "c1.medium"  : 0.145,
    "c1.xlarge"  : 0.580,
    "c3.2xlarge" : 0.600,
    "c3.4xlarge" : 1.200,
    "c3.8xlarge" : 2.400,
    "c3.large"   : 0.150,
    "c3.xlarge"  : 0.300,
    "cc2.8xlarge": 2.400,
    "cg1.4xlarge": 2.100,
    "cr1.8xlarge": 3.500,
    "g2.2xlarge" : 0.650,
    "hi1.4xlarge": 3.100,
    "hs1.8xlarge": 4.600,
    "m1.large"   : 0.240,
    "m1.medium"  : 0.120,
    "m1.small"   : 0.060,
    "m1.xlarge"  : 0.480,
    "m2.2xlarge" : 0.820,
    "m2.4xlarge" : 1.640,
    "m2.xlarge"  : 0.410,
    "m3.2xlarge" : 0.900,
    "m3.xlarge"  : 0.450,
    "t1.micro"   : 0.020,
  },
  "us-west-2" : {
    "c1.medium"  : 0.145,
    "c1.xlarge"  : 0.580,
    "c3.2xlarge" : 0.600,
    "c3.4xlarge" : 1.200,
    "c3.8xlarge" : 2.400,
    "c3.large"   : 0.150,
    "c3.xlarge"  : 0.300,
    "cc2.8xlarge": 2.400,
    "cr1.8xlarge": 3.500,
    "g2.2xlarge" : 0.650,
    "hi1.4xlarge": 3.100,
    "hs1.8xlarge": 4.600,
    "m1.large"   : 0.240,
    "m1.medium"  : 0.120,
    "m1.small"   : 0.060,
    "m1.xlarge"  : 0.480,
    "m2.2xlarge" : 0.820,
    "m2.4xlarge" : 1.640,
    "m2.xlarge"  : 0.410,
    "m3.2xlarge" : 0.900,
    "m3.xlarge"  : 0.450,
    "t1.micro"   : 0.020,
  },
  "us-west-1" : {
    "c1.medium"  : 0.165,
    "c1.xlarge"  : 0.660,
    "g2.2xlarge" : 0.702,
    "m1.large"   : 0.260,
    "m1.medium"  : 0.130,
    "m1.small"   : 0.065,
    "m1.xlarge"  : 0.520,
    "m2.2xlarge" : 0.920,
    "m2.4xlarge" : 1.840,
    "m2.xlarge"  : 0.460,
    "m3.2xlarge" : 0.990,
    "m3.xlarge"  : 0.495,
    "t1.micro"   : 0.025,
  },
  "eu-west-1" : {
    "c1.medium"  : 0.165,
    "c1.xlarge"  : 0.660,
    "c3.2xlarge" : 0.683,
    "c3.4xlarge" : 1.366,
    "c3.8xlarge" : 2.732,
    "c3.large"   : 0.171,
    "c3.xlarge"  : 0.342,
    "cc2.8xlarge": 2.700,
    "cg1.4xlarge": 2.36,
    "cr1.8xlarge": 3.750,
    "g2.2xlarge" : 0.702,
    "hi1.4xlarge": 3.410,
    "hs1.8xlarge": 4.900,
    "m1.large"   : 0.260,
    "m1.medium"  : 0.130,
    "m1.small"   : 0.065,
    "m1.xlarge"  : 0.520,
    "m2.2xlarge" : 0.920,
    "m2.4xlarge" : 1.840,
    "m2.xlarge"  : 0.460,
    "m3.2xlarge" : 0.990,
    "m3.xlarge"  : 0.495,
    "t1.micro"   : 0.020,
  },
  "ap-southeast-1" : {
    "c1.medium"  : 0.183,
    "c1.xlarge"  : 0.730,
    "c3.2xlarge" : 0.756,
    "c3.4xlarge" : 1.512,
    "c3.8xlarge" : 3.024,
    "c3.large"   : 0.189,
    "c3.xlarge"  : 0.378,
    "hs1.8xlarge": 5.570,
    "m1.large"   : 0.320,
    "m1.medium"  : 0.160,
    "m1.small"   : 0.080,
    "m1.xlarge"  : 0.640,
    "m2.2xlarge" : 0.990,
    "m2.4xlarge" : 1.980,
    "m2.xlarge"  : 0.495,
    "m3.2xlarge" : 1.260,
    "m3.xlarge"  : 0.630,
    "t1.micro"   : 0.020,
  },
  "ap-northeast-1" : {
    "c1.medium"  : 0.185,
    "c1.xlarge"  : 0.740,
    "c3.2xlarge" : 0.766,
    "c3.4xlarge" : 1.532,
    "c3.8xlarge" : 3.064,
    "c3.large"   : 0.192,
    "c3.xlarge"  : 0.383,
    "cc2.8xlarge": 2.960,
    "cr1.8xlarge": 4.310,
    "hi1.4xlarge": 3.820,
    "hs1.8xlarge": 5.670,
    "m1.large"   : 0.350,
    "m1.medium"  : 0.175,
    "m1.small"   : 0.088,
    "m1.xlarge"  : 0.700,
    "m2.2xlarge" : 1.010,
    "m2.4xlarge" : 2.020,
    "m2.xlarge"  : 0.505,
    "m3.2xlarge" : 1.368,
    "m3.xlarge"  : 0.684,
    "t1.micro"   : 0.027,
  },
  "ap-southeast-2" : {
    "c1.medium"  : 0.183,
    "c1.xlarge"  : 0.730,
    "c3.2xlarge" : 0.756,
    "c3.4xlarge" : 1.512,
    "c3.8xlarge" : 3.024,
    "c3.large"   : 0.189,
    "c3.xlarge"  : 0.378,
    "hs1.8xlarge": 5.570,
    "m1.large"   : 0.320,
    "m1.medium"  : 0.160,
    "m1.small"   : 0.080,
    "m1.xlarge"  : 0.640,
    "m2.2xlarge" : 0.990,
    "m2.4xlarge" : 1.980,
    "m2.xlarge"  : 0.495,
    "m3.2xlarge" : 1.260,
    "m3.xlarge"  : 0.630,
    "t1.micro"   : 0.020,
  },
  "sa-east-1" : {
    "c1.medium"  : 0.200,
    "c1.xlarge"  : 0.800,
    "m1.large"   : 0.320,
    "m1.medium"  : 0.160,
    "m1.small"   : 0.080,
    "m1.xlarge"  : 0.640,
    "m2.2xlarge" : 1.080,
    "m2.4xlarge" : 2.160,
    "m2.xlarge"  : 0.540,
    "m3.2xlarge" : 1.224,
    "m3.xlarge"  : 0.612,
    "t1.micro"   : 0.027,
  },
};

var __calcWindowsMonthlyAmount__rateSheets = {
  "us-east-1" : {
    "c1.medium"  : 0.225,
    "c1.xlarge"  : 0.900,
    "c3.2xlarge" : 0.932,
    "c3.4xlarge" : 1.864,
    "c3.8xlarge" : 3.728,
    "c3.large"   : 0.233,
    "c3.xlarge"  : 0.466,
    "cc2.8xlarge": 2.970,
    "cg1.4xlarge": 2.600,
    "cr1.8xlarge": 3.831,
    "g2.2xlarge" : 0.767,
    "hi1.4xlarge": 3.580,
    "hs1.8xlarge": 4.931,
    "m1.large"   : 0.364,
    "m1.medium"  : 0.182,
    "m1.small"   : 0.091,
    "m1.xlarge"  : 0.728,
    "m2.2xlarge" : 1.020,
    "m2.4xlarge" : 2.040,
    "m2.xlarge"  : 0.510,
    "m3.2xlarge" : 1.404,
    "m3.xlarge"  : 0.702,
    "t1.micro"   : 0.020,
  },
  "us-west-2" : {
    "c1.medium"  : 0.225,
    "c1.xlarge"  : 0.900,
    "c3.2xlarge" : 0.932,
    "c3.4xlarge" : 1.864,
    "c3.8xlarge" : 3.728,
    "c3.large"   : 0.233,
    "c3.xlarge"  : 0.466,
    "cc2.8xlarge": 2.970,
    "cr1.8xlarge": 3.831,
    "g2.2xlarge" : 0.767,
    "hi1.4xlarge": 3.580,
    "hs1.8xlarge": 4.931,
    "m1.large"   : 0.364,
    "m1.medium"  : 0.182,
    "m1.small"   : 0.091,
    "m1.xlarge"  : 0.728,
    "m2.2xlarge" : 1.020,
    "m2.4xlarge" : 2.040,
    "m2.xlarge"  : 0.510,
    "m3.2xlarge" : 1.404,
    "m3.xlarge"  : 0.702,
    "t1.micro"   : 0.020,
  },
  "us-west-1" : {
    "c1.medium"  : 0.245,
    "c1.xlarge"  : 0.980,
    "g2.2xlarge" : 0.819,
    "m1.large"   : 0.384,
    "m1.medium"  : 0.192,
    "m1.small"   : 0.096,
    "m1.xlarge"  : 0.768,
    "m2.2xlarge" : 1.120,
    "m2.4xlarge" : 2.240,
    "m2.xlarge"  : 0.560,
    "m3.2xlarge" : 1.494,
    "m3.xlarge"  : 0.747,
    "t1.micro"   : 0.035,
  },
  "eu-west-1" : {
    "c1.medium"  : 0.225,
    "c1.xlarge"  : 0.900,
    "c3.2xlarge" : 0.932,
    "c3.4xlarge" : 1.864,
    "c3.8xlarge" : 3.728,
    "c3.large"   : 0.233,
    "c3.xlarge"  : 0.466,
    "cc2.8xlarge": 2.970,
    "cg1.4xlarge": 2.600,
    "cr1.8xlarge": 3.831,
    "g2.2xlarge" : 0.767,
    "hi1.4xlarge": 3.580,
    "hs1.8xlarge": 4.931,
    "m1.large"   : 0.364,
    "m1.medium"  : 0.182,
    "m1.small"   : 0.091,
    "m1.xlarge"  : 0.728,
    "m2.2xlarge" : 1.020,
    "m2.4xlarge" : 2.040,
    "m2.xlarge"  : 0.510,
    "m3.2xlarge" : 1.404,
    "m3.xlarge"  : 0.702,
    "t1.micro"   : 0.035,
  },
  "ap-southeast-1" : {
    "c1.medium"  : 0.285,
    "c1.xlarge"  : 1.140,
    "c3.2xlarge" : 1.180,
    "c3.4xlarge" : 2.360,
    "c3.8xlarge" : 4.720,
    "c3.large"   : 0.295,
    "c3.xlarge"  : 0.590,
    "hs1.8xlarge": 5.901,
    "m1.large"   : 0.460,
    "m1.medium"  : 0.230,
    "m1.small"   : 0.115,
    "m1.xlarge"  : 0.920,
    "m2.2xlarge" : 1.140,
    "m2.4xlarge" : 2.280,
    "m2.xlarge"  : 0.570,
    "m3.2xlarge" : 1.764,
    "m3.xlarge"  : 0.882,
    "t1.micro"   : 0.020,
  },
  "ap-northeast-1" : {
    "c1.medium"  : 0.285,
    "c1.xlarge"  : 1.140,
    "c3.2xlarge" : 1.180,
    "c3.4xlarge" : 2.360,
    "c3.8xlarge" : 4.720,
    "c3.large"   : 0.295,
    "c3.xlarge"  : 0.590,
    "cc2.8xlarge": 3.530,
    "cr1.8xlarge": 4.641,
    "hi1.4xlarge": 4.300,
    "hs1.8xlarge": 6.000,
    "m1.large"   : 0.460,
    "m1.medium"  : 0.230,
    "m1.small"   : 0.115,
    "m1.xlarge"  : 0.920,
    "m2.2xlarge" : 1.140,
    "m2.4xlarge" : 2.280,
    "m2.xlarge"  : 0.570,
    "m3.2xlarge" : 1.764,
    "m3.xlarge"  : 0.882,
    "t1.micro"   : 0.035,
  },
  "ap-southeast-2" : {
    "c1.medium"  : 0.285,
    "c1.xlarge"  : 1.140,
    "c3.2xlarge" : 1.180,
    "c3.4xlarge" : 2.360,
    "c3.8xlarge" : 4.720,
    "c3.large"   : 0.295,
    "c3.xlarge"  : 0.590,
    "hs1.8xlarge": 5.901,
    "m1.large"   : 0.460,
    "m1.medium"  : 0.230,
    "m1.small"   : 0.115,
    "m1.xlarge"  : 0.920,
    "m2.2xlarge" : 1.140,
    "m2.4xlarge" : 2.280,
    "m2.xlarge"  : 0.570,
    "m3.2xlarge" : 1.764,
    "m3.xlarge"  : 0.882,
    "t1.micro"   : 0.020,
  },
  "sa-east-1" : {
    "c1.medium"  : 0.280,
    "c1.xlarge"  : 1.120,
    "m1.large"   : 0.444,
    "m1.medium"  : 0.222,
    "m1.small"   : 0.111,
    "m1.xlarge"  : 0.888,
    "m2.2xlarge" : 1.280,
    "m2.4xlarge" : 2.560,
    "m2.xlarge"  : 0.640,
    "m3.2xlarge" : 1.728,
    "m3.xlarge"  : 0.864,
    "t1.micro"   : 0.037,
  },
};

// Reserved Instances (Light)
var __calcLightRILinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [  69, 0.039,  106.30, 0.031],
    'm1.medium'  : [ 138, 0.078,  212.50, 0.063],
    'm1.large'   : [ 276, 0.156,  425.20, 0.124],
    'm1.xlarge'  : [ 552, 0.312,  850.40, 0.248],
    'm3.xlarge'  : [ 607, 0.344,  935   , 0.272],
    'm3.2xlarge' : [1214, 0.688, 1870   , 0.544],
    't1.micro'   : [  23, 0.012,   35   , 0.012],
    'm2.xlarge'  : [ 353, 0.220,  548   , 0.175],
    'm2.2xlarge' : [ 706, 0.440, 1096   , 0.350],
    'm2.4xlarge' : [1412, 0.880, 2192   , 0.700],
    'c1.medium'  : [ 178, 0.100,  273   , 0.088],
    'c1.xlarge'  : [ 712, 0.400, 1092   , 0.352],
    'cc1.4xlarge': [1450, 0.742, 2225   , 0.742],
    'cc2.8xlarge': [1762, 0.904, 2710   , 0.904],
    'cg1.4xlarge': [2410, 1.234, 3700   , 1.234],
    'hi1.4xlarge': [2576, 1.477, 3884   , 1.150],
    'hs1.8xlarge': [3968, 2.240, 5997   , 1.810],
  },
  'us-west-1' : {
    'm1.small'  : [  69, 0.049,  106.30, 0.039],
    'm1.medium' : [ 138, 0.098,  212.50, 0.078],
    'm1.large'  : [ 276, 0.196,  425.20, 0.156],
    'm1.xlarge' : [ 552, 0.392,  850.40, 0.312],
    't1.micro'  : [  23, 0.015,   35   , 0.015],
    'm2.xlarge' : [ 353, 0.288,  548   , 0.230],
    'm2.2xlarge': [ 706, 0.576, 1096   , 0.460],
    'm2.4xlarge': [1412, 1.152, 2192   , 0.920],
    'c1.medium' : [ 178, 0.125,  273   , 0.110],
    'c1.xlarge' : [ 712, 0.500, 1092   , 0.440],
  },
  'us-west-2' : {
    'm1.small'   : [  69, 0.039,  106.30, 0.031],
    'm1.medium'  : [ 138, 0.078,  212.50, 0.063],
    'm1.large'   : [ 276, 0.156,  425.20, 0.124],
    'm1.xlarge'  : [ 552, 0.312,  850.40, 0.248],
    't1.micro'   : [  23, 0.012,   35   , 0.012],
    'm2.xlarge'  : [ 353, 0.220,  548   , 0.175],
    'm2.2xlarge' : [ 706, 0.440, 1096   , 0.350],
    'm2.4xlarge' : [1412, 0.880, 2192   , 0.700],
    'c1.medium'  : [ 178, 0.100,  273   , 0.088],
    'c1.xlarge'  : [ 712, 0.400, 1092   , 0.352],
    'cc2.8xlarge': [1762, 0.904, 2710   , 0.904],
  },
  'eu-west-1' : {
    'm1.small'   : [  69, 0.049,  106.30, 0.039],
    'm1.medium'  : [ 138, 0.098,  212.50, 0.078],
    'm1.large'   : [ 276, 0.196,  425.20, 0.156],
    'm1.xlarge'  : [ 552, 0.392,  850.40, 0.312],
    't1.micro'   : [  23, 0.015,   35   , 0.015],
    'm2.xlarge'  : [ 353, 0.288,  548   , 0.230],
    'm2.2xlarge' : [ 706, 0.576, 1096   , 0.460],
    'm2.4xlarge' : [1412, 1.152, 2192   , 0.920],
    'c1.medium'  : [ 178, 0.125,  273   , 0.110],
    'c1.xlarge'  : [ 712, 0.500, 1092   , 0.440],
    'cc2.8xlarge': [1762, 1.180, 2710   , 1.180], // $0.180?
    'cg1.4xlarge': [2410, 1.610, 3700   , 1.610],
    'hi1.4xlarge': [2576, 2.605, 3884   , 2.035],
  },
  'ap-southeast-1' : {
    'm1.small'  : [  69, 0.049,  106.30, 0.039],
    'm1.medium' : [ 138, 0.098,  212.50, 0.078],
    'm1.large'  : [ 276, 0.196,  425.20, 0.156],
    'm1.xlarge' : [ 552, 0.392,  850.40, 0.312],
    't1.micro'  : [  23, 0.015,   35   , 0.015],
    'm2.xlarge' : [ 353, 0.288,  548   , 0.230],
    'm2.2xlarge': [ 706, 0.576, 1096   , 0.460],
    'm2.4xlarge': [1412, 1.152, 2192   , 0.920],
    'c1.medium' : [ 178, 0.125,  273   , 0.110],
    'c1.xlarge' : [ 712, 0.500, 1092   , 0.440],
  },
  'ap-northeast-1' : {
    'm1.small'  : [  72, 0.054,  111.60, 0.043],
    'm1.medium' : [ 144, 0.108,  223.20, 0.085],
    'm1.large'  : [ 288, 0.216,  446.40, 0.172],
    'm1.xlarge' : [ 576, 0.432,  892.80, 0.344],
    't1.micro'  : [  24, 0.017,   37   , 0.017],
    'm2.xlarge' : [ 373, 0.320,  575   , 0.255],
    'm2.2xlarge': [ 746, 0.640, 1150   , 0.510],
    'm2.4xlarge': [1492, 1.280, 2300   , 1.020],
    'c1.medium' : [ 187, 0.138,  286   , 0.120],
    'c1.xlarge' : [ 748, 0.550, 1144   , 0.480],
  },
  'ap-southeast-2' : {
    'm1.small'  : [  69, 0.049,  106.30, 0.039],
    'm1.medium' : [ 138, 0.098,  212.50, 0.078],
    'm1.large'  : [ 276, 0.196,  425.20, 0.156],
    'm1.xlarge' : [ 552, 0.392,  850.40, 0.312],
    't1.micro'  : [  23, 0.015,   35   , 0.015],
    'm2.xlarge' : [ 353, 0.288,  548   , 0.230],
    'm2.2xlarge': [ 706, 0.576, 1096   , 0.460],
    'm2.4xlarge': [1412, 1.152, 2192   , 0.920],
    'c1.medium' : [ 178, 0.125,  273   , 0.110],
    'c1.xlarge' : [ 712, 0.500, 1092   , 0.440],
  },
  'sa-east-1' : {
    'm1.small'  : [ 131.63, 0.070,  203, 0.055],
    'm1.medium' : [ 263.50, 0.135,  405, 0.110],
    'm1.large'  : [ 527,    0.270,  810, 0.220],
    'm1.xlarge' : [1053,    0.540, 1620, 0.440],
    't1.micro'  : [  31,    0.016,   47, 0.016],
    'm2.xlarge' : [ 749,    0.380, 1151, 0.308],
    'm2.2xlarge': [1485,    0.770, 2302, 0.616],
    'm2.4xlarge': [2970,    1.540, 4604, 1.232],
    'c1.medium' : [ 263,    0.135,  405, 0.118],
    'c1.xlarge' : [1053,    0.540, 1620, 0.472],
  },
};

var __calcLightRIWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [  69, 0.059,  106.30, 0.051],
    'm1.medium'  : [ 138, 0.118,  212.50, 0.103],
    'm1.large'   : [ 276, 0.235,  425.20, 0.204],
    'm1.xlarge'  : [ 552, 0.470,  850.40, 0.408],
    'm3.xlarge'  : [ 607, 0.504,  935   , 0.432],
    'm3.2xlarge' : [1214, 1.008, 1870   , 0.864],
    't1.micro'   : [  23, 0.014,   35   , 0.012],
    'm2.xlarge'  : [ 353, 0.290,  548   , 0.245],
    'm2.2xlarge' : [ 706, 0.580, 1096   , 0.490],
    'm2.4xlarge' : [1412, 1.160, 2192   , 0.980],
    'c1.medium'  : [ 178, 0.165,  273   , 0.153],
    'c1.xlarge'  : [ 712, 0.660, 1092   , 0.612],
    'cc1.4xlarge': [1450, 0.922, 2225   , 0.922],
    'cc2.8xlarge': [1762, 1.114, 2710   , 1.114],
    'cg1.4xlarge': [2410, 1.534, 3700   , 1.534],
    'hi1.4xlarge': [2576, 1.957, 3884   , 1.630],
    'hs1.8xlarge': [3968, 2.571, 5997   , 2.141],
  },
  'us-west-1' : {
    'm1.small'   : [  69, 0.069,  106.30, 0.059],
    'm1.medium'  : [ 138, 0.138,  212.50, 0.118],
    'm1.large'   : [ 276, 0.275,  425.20, 0.236],
    'm1.xlarge'  : [ 552, 0.550,  850.40, 0.472],
    't1.micro'   : [  23, 0.021,   35   , 0.021],
    'm2.xlarge'  : [ 353, 0.368,  548   , 0.310],
    'm2.2xlarge' : [ 706, 0.735, 1096   , 0.620],
    'm2.4xlarge' : [1412, 1.470, 2192   , 1.240],
    'c1.medium'  : [ 178, 0.190,  273   , 0.175],
    'c1.xlarge'  : [ 712, 0.760, 1092   , 0.700],
  },
  'us-west-2' : {
    'm1.small'   : [  69, 0.059,  106.30, 0.051],
    'm1.medium'  : [ 138, 0.118,  212.50, 0.103],
    'm1.large'   : [ 276, 0.235,  425.20, 0.204],
    'm1.xlarge'  : [ 552, 0.470,  850.40, 0.408],
    't1.micro'   : [  23, 0.014,   35   , 0.018],
    'm2.xlarge'  : [ 353, 0.290,  548   , 0.245],
    'm2.2xlarge' : [ 706, 0.580, 1096   , 0.490],
    'm2.4xlarge' : [1412, 1.160, 2192   , 0.980],
    'c1.medium'  : [ 178, 0.165,  273   , 0.153],
    'c1.xlarge'  : [ 712, 0.660, 1092   , 0.612],
    'cc2.8xlarge': [1762, 1.114, 2710   , 1.114],
  },
  'eu-west-1' : {
    'm1.small'   : [  69, 0.069,  106.30, 0.059],
    'm1.medium'  : [ 138, 0.138,  212.50, 0.118],
    'm1.large'   : [ 276, 0.275,  425.20, 0.236],
    'm1.xlarge'  : [ 552, 0.550,  850.40, 0.472],
    't1.micro'   : [  23, 0.016,   35   , 0.016],
    'm2.xlarge'  : [ 353, 0.368,  548   , 0.310],
    'm2.2xlarge' : [ 706, 0.735, 1096   , 0.620],
    'm2.4xlarge' : [1412, 1.470, 2192   , 1.240],
    'c1.medium'  : [ 178, 0.190,  273   , 0.175],
    'c1.xlarge'  : [ 712, 0.760, 1092   , 0.700],
    'cc2.8xlarge': [8060, 1.443,23680   , 4.730],
    'cg1.4xlarge': [2410, 1.986, 3700   , 1.953],
    'hi1.4xlarge': [4124, 2.520, 9884   , 3.593],
  },
  'ap-southeast-1' : {
    'm1.small'  : [  69, 0.069,  106.30, 0.059],
    'm1.medium' : [ 138, 0.138,  212.50, 0.118],
    'm1.large'  : [ 276, 0.275,  425.20, 0.236],
    'm1.xlarge' : [ 552, 0.550,  850.40, 0.472],
    't1.micro'  : [  23, 0.021,   35   , 0.021],
    'm2.xlarge' : [ 353, 0.368,  548   , 0.310],
    'm2.2xlarge': [ 706, 0.735, 1096   , 0.620],
    'm2.4xlarge': [1412, 1.470, 2192   , 1.240],
    'c1.medium' : [ 178, 0.190,  273   , 0.175],
    'c1.xlarge' : [ 712, 0.760, 1092   , 0.700],
  },
  'ap-northeast-1' : {
    'm1.small'  : [  72, 0.076,  111.60, 0.065],
    'm1.medium' : [ 144, 0.153,  223.20, 0.130],
    'm1.large'  : [ 972, 0.305, 2295   , 0.260],
    'm1.xlarge' : [1944, 0.610, 4590   , 0.520],
    't1.micro'  : [  24, 0.027,   37   , 0.027],
    'm2.xlarge' : [1044, 0.403, 2403   , 0.338],
    'm2.2xlarge': [2088, 0.805, 4806   , 0.676],
    'm2.4xlarge': [4176, 1.610, 9612   , 1.352],
    'c1.medium' : [ 187, 0.208,  286   , 0.193],
    'c1.xlarge' : [3510, 0.830, 8595   , 0.772],
  },
  'ap-southeast-2' : {
    'm1.small'  : [  69, 0.069,  106.30, 0.059],
    'm1.medium' : [ 138, 0.138,  212.50, 0.118],
    'm1.large'  : [ 276, 0.275,  425.20, 0.236],
    'm1.xlarge' : [ 552, 0.550,  850.40, 0.472],
    't1.micro'  : [  23, 0.016,   35   , 0.016],
    'm2.xlarge' : [ 353, 0.368,  548   , 0.310],
    'm2.2xlarge': [ 706, 0.735, 1096   , 0.620],
    'm2.4xlarge': [1412, 1.470, 2192   , 1.240],
    'c1.medium' : [ 178, 0.190,  273   , 0.175],
    'c1.xlarge' : [ 712, 0.760, 1092   , 0.700],
  },
  'sa-east-1' : {
    'm1.small'  : [ 131.63, 0.090,  203, 0.075],
    'm1.medium' : [ 263.50, 0.175,  405, 0.150],
    'm1.large'  : [ 527,    0.350,  810, 0.300],
    'm1.xlarge' : [1053,    0.700, 1620, 0.600],
    't1.micro'  : [  31,    0.022,   47, 0.022],
    'm2.xlarge' : [ 749,    0.450, 1151, 0.378],
    'm2.2xlarge': [1485,    0.910, 2302, 0.756],
    'm2.4xlarge': [2970,    1.820, 4604, 1.512],
    'c1.medium' : [ 263,    0.200,  405, 0.183],
    'c1.xlarge' : [1053,    0.800, 1620, 0.732],
  },
};

// Reserved Instances (Medium)
var __calcMediumRILinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 160, 0.024,  250, 0.019],
    'm1.medium'  : [ 320, 0.048,  500, 0.038],
    'm1.large'   : [ 640, 0.096, 1000, 0.076],
    'm1.xlarge'  : [1280, 0.192, 2000, 0.152],
    'm3.xlarge'  : [1408, 0.211, 2200, 0.167],
    'm3.2xlarge' : [2816, 0.422, 4400, 0.334],
    't1.micro'   : [  54, 0.007,   82, 0.007],
    'm2.xlarge'  : [ 850, 0.133, 1283, 0.105],
    'm2.2xlarge' : [1700, 0.266, 2566, 0.210],
    'm2.4xlarge' : [3400, 0.532, 5132, 0.420],
    'c1.medium'  : [ 415, 0.060,  638, 0.053],
    'c1.xlarge'  : [1660, 0.240, 2552, 0.212],
    'cc1.4xlarge': [3286, 0.450, 5056, 0.450],
    'cc2.8xlarge': [4146, 0.540, 6378, 0.540],
    'cg1.4xlarge': [5630, 0.740, 8650, 0.740],
    'hi1.4xlarge': [5973, 0.909, 9133, 0.705],
    'hs1.8xlarge': [9200, 1.380,14103, 1.110],
  },
  'us-west-1' : {
    'm1.small'  : [ 160, 0.031,  250, 0.025],
    'm1.medium' : [ 320, 0.063,  500, 0.050],
    'm1.large'  : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge' : [1280, 0.248, 2000, 0.200],
    't1.micro'  : [  54, 0.010,   82, 0.010],
    'm2.xlarge' : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge': [1700, 0.370, 2566, 0.296],
    'm2.4xlarge': [3400, 0.740, 5132, 0.592],
    'c1.medium' : [ 415, 0.080,  638, 0.070],
    'c1.xlarge' : [1660, 0.320, 2552, 0.280],
  },
  'us-west-2' : {
    'm1.small'   : [ 160, 0.024,  250, 0.019],
    'm1.medium'  : [ 320, 0.048,  500, 0.038],
    'm1.large'   : [ 640, 0.096, 1000, 0.076],
    'm1.xlarge'  : [1280, 0.192, 2000, 0.152],
    't1.micro'   : [  54, 0.007,   82, 0.007],
    'm2.xlarge'  : [ 850, 0.133, 1283, 0.105],
    'm2.2xlarge' : [1700, 0.266, 2566, 0.210],
    'm2.4xlarge' : [3400, 0.532, 5132, 0.420],
    'c1.medium'  : [ 415, 0.060,  638, 0.053],
    'c1.xlarge'  : [1660, 0.240, 2552, 0.212],
    'cc2.8xlarge': [4146, 0.540, 6378, 0.540],
  },
  'eu-west-1' : {
    'm1.small'   : [ 160, 0.031,  250, 0.025],
    'm1.medium'  : [ 320, 0.063,  500, 0.050],
    'm1.large'   : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge'  : [1280, 0.248, 2000, 0.200],
    't1.micro'   : [  54, 0.010,   82, 0.010],
    'm2.xlarge'  : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge' : [1700, 0.370, 2566, 0.296],
    'm2.4xlarge' : [3400, 0.740, 5132, 0.592],
    'c1.medium'  : [ 415, 0.080,  638, 0.070],
    'c1.xlarge'  : [1660, 0.320, 2552, 0.280],
    'cc2.8xlarge': [4146, 0.750, 6378, 0.750],
    'cg1.4xlarge': [5630, 1.030, 8650, 1.030],
    'hi1.4xlarge': [5973, 1.379, 9133, 1.022],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 160, 0.031,  250, 0.025],
    'm1.medium' : [ 320, 0.063,  500, 0.050],
    'm1.large'  : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge' : [1280, 0.248, 2000, 0.200],
    't1.micro'  : [  54, 0.010,   82, 0.010],
    'm2.xlarge' : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge': [1700, 0.370, 2566, 0.296],
    'm2.4xlarge': [3400, 0.740, 5132, 0.592],
    'c1.medium' : [ 415, 0.080,  638, 0.070],
    'c1.xlarge' : [1660, 0.320, 2552, 0.280],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 168, 0.036,  262.50, 0.029],
    'm1.medium' : [ 336, 0.073,  525, 0.058],
    'm1.large'  : [ 672, 0.144, 1050, 0.116],
    'm1.xlarge' : [1344, 0.288, 2100, 0.232],
    't1.micro'  : [  57, 0.011,   86, 0.011],
    'm2.xlarge' : [ 893, 0.208, 1347, 0.165],
    'm2.2xlarge': [1786, 0.416, 2694, 0.330],
    'm2.4xlarge': [3572, 0.832, 5388, 0.660],
    'c1.medium' : [ 436, 0.090,  670, 0.080],
    'c1.xlarge' : [1744, 0.360, 2680, 0.320],
  },
  'ap-southeast-2' : {
    'm1.small'  : [ 160, 0.031,  250, 0.025],
    'm1.medium' : [ 320, 0.063,  500, 0.050],
    'm1.large'  : [ 640, 0.124, 1000, 0.100],
    'm1.xlarge' : [1280, 0.248, 2000, 0.200],
    't1.micro'  : [  54, 0.010,   82, 0.010],
    'm2.xlarge' : [ 850, 0.185, 1283, 0.148],
    'm2.2xlarge': [1700, 0.370, 2566, 0.296],
    'm2.4xlarge': [3400, 0.740, 5132, 0.592],
    'c1.medium' : [ 415, 0.080,  638, 0.070],
    'c1.xlarge' : [1660, 0.320, 2552, 0.280],
  },
  'sa-east-1' : {
    'm1.small'  : [ 307.13, 0.040,   473, 0.031],
    'm1.medium' : [ 614.50, 0.080,   945, 0.063],
    'm1.large'  : [1229   , 0.160,  1890, 0.124],
    'm1.xlarge' : [2457   , 0.320,  3780, 0.248],
    't1.micro'  : [  73   , 0.009,   111, 0.009],
    'm2.xlarge' : [1789   , 0.230,  2700, 0.183],
    'm2.2xlarge': [3578   , 0.460,  5400, 0.366],
    'm2.4xlarge': [7155   , 0.920, 10800, 0.732],
    'c1.medium' : [ 614   , 0.080,   945, 0.070],
    'c1.xlarge' : [2457   , 0.320,  3780, 0.280],
  },
};

var __calcMediumRIWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 160, 0.044,  250, 0.039],
    'm1.medium'  : [ 320, 0.088,  500, 0.078],
    'm1.large'   : [ 640, 0.175, 1000, 0.156],
    'm1.xlarge'  : [1280, 0.350, 2000, 0.312],
    'm3.xlarge'  : [1408, 0.371, 2200, 0.327],
    'm3.2xlarge' : [2816, 0.742, 4400, 0.654],
    't1.micro'   : [  54, 0.009,   82, 0.009],
    'm2.xlarge'  : [ 850, 0.203, 1283, 0.175],
    'm2.2xlarge' : [1700, 0.405, 2566, 0.350],
    'm2.4xlarge' : [3400, 0.810, 5132, 0.700],
    'c1.medium'  : [ 415, 0.125,  638, 0.118],
    'c1.xlarge'  : [1660, 0.500, 2552, 0.472],
    'cc1.4xlarge': [3286, 0.630, 5056, 0.630],
    'cc2.8xlarge': [4146, 0.750, 6378, 0.750],
    'cg1.4xlarge': [5630, 1.040, 8650, 1.040],
    'hi1.4xlarge': [5973, 1.389, 9133, 1.185],
    'hs1.8xlarge': [9200, 1.711,14103, 1.441],
  },
  'us-west-1' : {
    'm1.small'   : [ 160, 0.051,  250, 0.045],
    'm1.medium'  : [ 320, 0.103,  500, 0.090],
    'm1.large'   : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge'  : [1280, 0.410, 2000, 0.360],
    't1.micro'   : [  54, 0.016,   82, 0.016],
    'm2.xlarge'  : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge' : [1700, 0.530, 2566, 0.456],
    'm2.4xlarge' : [3400, 1.060, 5132, 0.912],
    'c1.medium'  : [ 415, 0.145,  638, 0.135],
    'c1.xlarge'  : [1660, 0.580, 2552, 0.540],
  },
  'us-west-2' : {
    'm1.small'  : [ 160, 0.044,  250, 0.039],
    'm1.medium' : [ 320, 0.088,  500, 0.078],
    'm1.large'  : [ 640, 0.175, 1000, 0.156],
    'm1.xlarge' : [1280, 0.350, 2000, 0.312],
    't1.micro'  : [  54, 0.013,   82, 0.013],
    'm2.xlarge' : [ 850, 0.203, 1283, 0.175],
    'm2.2xlarge': [1700, 0.405, 2566, 0.350],
    'm2.4xlarge': [3400, 0.810, 5132, 0.700],
    'c1.medium' : [ 415, 0.125,  638, 0.118],
    'c1.xlarge' : [1660, 0.500, 2552, 0.472],
  },
  'eu-west-1' : {
    'm1.small'   : [ 160, 0.051,  250, 0.045],
    'm1.medium'  : [ 320, 0.103,  500, 0.090],
    'm1.large'   : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge'  : [1280, 0.410, 2000, 0.360],
    't1.micro'   : [  54, 0.012,   82, 0.012],
    'm2.xlarge'  : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge' : [1700, 0.530, 2566, 0.456],
    'm2.4xlarge' : [3400, 1.060, 5132, 0.912],
    'c1.medium'  : [ 415, 0.145,  638, 0.135],
    'c1.xlarge'  : [1660, 0.580, 2552, 0.540],
    'cc2.8xlarge': [9880, 1.056,28120, 4.280],
    'cg1.4xlarge': [5630, 1.461, 8650, 1.382],
    'hi1.4xlarge': [5973, 3.715, 9133, 1.568],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 160, 0.051,  250, 0.045],
    'm1.medium' : [ 320, 0.103,  500, 0.090],
    'm1.large'  : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge' : [1280, 0.410, 2000, 0.360],
    't1.micro'  : [  54, 0.012,   82, 0.012],
    'm2.xlarge' : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge': [1700, 0.530, 2566, 0.456],
    'm2.4xlarge': [3400, 1.060, 5132, 0.912],
    'c1.medium' : [ 415, 0.145,  638, 0.135],
    'c1.xlarge' : [1660, 0.580, 2552, 0.540],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 168, 0.058,  262.50, 0.050],
    'm1.medium' : [ 336, 0.115,  525   , 0.100],
    'm1.large'  : [1314, 0.230, 2835   , 0.200],
    'm1.xlarge' : [2628, 0.460, 5670   , 0.400],
    't1.micro'  : [  57, 0.021,   86   , 0.021],
    'm2.xlarge' : [1512, 0.290, 3105   , 0.248],
    'm2.2xlarge': [3024, 0.580, 6210   , 0.496],
    'm2.4xlarge': [6048, 1.160,12420   , 0.992],
    'c1.medium' : [ 436, 0.160,  670   , 0.150],
    'c1.xlarge' : [4401, 0.640, 9972   , 0.600],
  },
  'ap-southeast-2' : {
    'm1.small'  : [ 160, 0.051,  250, 0.045],
    'm1.medium' : [ 320, 0.103,  500, 0.090],
    'm1.large'  : [ 640, 0.205, 1000, 0.180],
    'm1.xlarge' : [1280, 0.410, 2000, 0.360],
    't1.micro'  : [  54, 0.012,   82, 0.012],
    'm2.xlarge' : [ 850, 0.265, 1283, 0.228],
    'm2.2xlarge': [1700, 0.530, 2566, 0.456],
    'm2.4xlarge': [3400, 1.060, 5132, 0.912],
    'c1.medium' : [ 415, 0.145,  638, 0.135],
    'c1.xlarge' : [1660, 0.580, 2552, 0.540],
  },
  'sa-east-1' : {
    'm1.small'  : [ 307.13, 0.060,   473, 0.051],
    'm1.medium' : [ 614.50, 0.120,   945, 0.103],
    'm1.large'  : [1229   , 0.240,  1890, 0.204],
    'm1.xlarge' : [2457   , 0.480,  3780, 0.408],
    't1.micro'  : [  73   , 0.015,   111, 0.015],
    'm2.xlarge' : [1789   , 0.300,  2700, 0.253],
    'm2.2xlarge': [3578   , 0.600,  5400, 0.506],
    'm2.4xlarge': [7155   , 1.200, 10800, 1.012],
    'c1.medium' : [ 614   , 0.150,   945, 0.135],
    'c1.xlarge' : [2457   , 0.580,  3780, 0.540],
  },
};

// Reserved Instances (Heavy)
var __calcHeavyRILinuxMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 195, 0.016,   300, 0.013],
    'm1.medium'  : [ 390, 0.032,   600, 0.026],
    'm1.large'   : [ 780, 0.064,  1200, 0.052],
    'm1.xlarge'  : [1560, 0.128,  2400, 0.104],
    'm3.xlarge'  : [1716, 0.141,  2640, 0.115],
    'm3.2xlarge' : [3432, 0.282,  5280, 0.230],
    't1.micro'   : [  62, 0.005,   100, 0.005],
    'm2.xlarge'  : [1030, 0.088,  1550, 0.070],
    'm2.2xlarge' : [2060, 0.176,  3100, 0.140],
    'm2.4xlarge' : [4120, 0.352,  6200, 0.280],
    'c1.medium'  : [ 500, 0.040,   775, 0.035],
    'c1.xlarge'  : [2000, 0.160,  3100, 0.140],
    'cc1.4xlarge': [4060, 0.297,  6300, 0.297],
    'cc2.8xlarge': [5000, 0.361,  7670, 0.361],
    'cg1.4xlarge': [6830, 0.494, 10490, 0.494],
    'hi1.4xlarge': [7280, 0.621, 10960, 0.482],
    'hs1.8xlarge':[11213, 0.920, 16924, 0.760],
  },
  'us-west-1' : {
    'm1.small'  : [ 195, 0.025,  300, 0.020],
    'm1.medium' : [ 390, 0.050,  600, 0.040],
    'm1.large'  : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge' : [1560, 0.200, 2400, 0.160],
    't1.micro'  : [  62, 0.008,  100, 0.008],
    'm2.xlarge' : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge': [2060, 0.296, 3100, 0.236],
    'm2.4xlarge': [4120, 0.592, 6200, 0.472],
    'c1.medium' : [ 500, 0.063,  775, 0.055],
    'c1.xlarge' : [2000, 0.250, 3100, 0.220],
  },
  'us-west-2' : {
    'm1.small'   : [ 195, 0.016,  300, 0.013],
    'm1.medium'  : [ 390, 0.032,  600, 0.026],
    'm1.large'   : [ 780, 0.064, 1200, 0.052],
    'm1.xlarge'  : [1560, 0.128, 2400, 0.104],
    't1.micro'   : [  62, 0.005,  100, 0.005],
    'm2.xlarge'  : [1030, 0.088, 1550, 0.070],
    'm2.2xlarge' : [2060, 0.176, 3100, 0.140],
    'm2.4xlarge' : [4120, 0.352, 6200, 0.280],
    'c1.medium'  : [ 500, 0.040,  775, 0.035],
    'c1.xlarge'  : [2000, 0.160, 3100, 0.140],
    'cc2.8xlarge': [5000, 0.361, 7670, 0.361],
  },
  'eu-west-1' : {
    'm1.small'   : [ 195, 0.025,  300, 0.020],
    'm1.medium'  : [ 390, 0.050,  600, 0.040],
    'm1.large'   : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge'  : [1560, 0.200, 2400, 0.160],
    't1.micro'   : [  62, 0.008,  100, 0.008],
    'm2.xlarge'  : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge' : [2060, 0.296, 3100, 0.236],
    'm2.4xlarge' : [4120, 0.592, 6200, 0.472],
    'c1.medium'  : [ 500, 0.063,  775, 0.055],
    'c1.xlarge'  : [2000, 0.250, 3100, 0.220],
    'cc2.8xlarge': [5000, 0.610, 7670, 0.610],
    'cg1.4xlarge': [6830, 0.835,10490, 0.835],
    'hi1.4xlarge': [7280, 0.931,10960, 0.742],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 195, 0.025,  300, 0.020],
    'm1.medium' : [ 390, 0.050,  600, 0.040],
    'm1.large'  : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge' : [1560, 0.200, 2400, 0.160],
    't1.micro'  : [  62, 0.008,  100, 0.008],
    'm2.xlarge' : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge': [2060, 0.296, 3100, 0.236],
    'm2.4xlarge': [4120, 0.592, 6200, 0.472],
    'c1.medium' : [ 500, 0.063,  775, 0.055],
    'c1.xlarge' : [2000, 0.250, 3100, 0.220],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 205, 0.026,  315, 0.021],
    'm1.medium' : [ 410, 0.052,  630, 0.044],
    'm1.large'  : [ 820, 0.104, 1260, 0.084],
    'm1.xlarge' : [1640, 0.208, 2520, 0.168],
    't1.micro'  : [  65, 0.009,  105, 0.009],
    'm2.xlarge' : [1079, 0.163, 1628, 0.130],
    'm2.2xlarge': [2158, 0.326, 3256, 0.260],
    'm2.4xlarge': [4316, 0.652, 6512, 0.520],
    'c1.medium' : [ 530, 0.069,  814, 0.060],
    'c1.xlarge' : [2120, 0.276, 3256, 0.240],
  },
  'ap-southeast-2' : {
    'm1.small'  : [ 195, 0.025,  300, 0.020],
    'm1.medium' : [ 390, 0.050,  600, 0.040],
    'm1.large'  : [ 780, 0.100, 1200, 0.080],
    'm1.xlarge' : [1560, 0.200, 2400, 0.160],
    't1.micro'  : [  62, 0.008,  100, 0.008],
    'm2.xlarge' : [1030, 0.148, 1550, 0.118],
    'm2.2xlarge': [2060, 0.296, 3100, 0.236],
    'm2.4xlarge': [4120, 0.592, 6200, 0.472],
    'c1.medium' : [ 500, 0.063,  775, 0.055],
    'c1.xlarge' : [2000, 0.250, 3100, 0.220],
  },
  'sa-east-1' : {
    'm1.small'  : [ 372.94, 0.030,   574, 0.021],
    'm1.medium' : [ 746   , 0.055,  1148, 0.043],
    'm1.large'  : [1492   , 0.110,  2295, 0.084],
    'm1.xlarge' : [2984   , 0.220,  4590, 0.168],
    't1.micro'  : [  84   , 0.007,   135, 0.007],
    'm2.xlarge' : [2160   , 0.153,  3260, 0.123],
    'm2.2xlarge': [4320   , 0.305,  6521, 0.246],
    'm2.4xlarge': [8640   , 0.610, 13041, 0.492],
    'c1.medium' : [ 747   , 0.055,  1148, 0.048],
    'c1.xlarge' : [2984   , 0.220,  4590, 0.192],
  },
};

var __calcHeavyRIWindowsMonthlyAmount__rateSheets = {
  'us-east-1' : {
    'm1.small'   : [ 195, 0.036,   300, 0.033],
    'm1.medium'  : [ 390, 0.073,   600, 0.066],
    'm1.large'   : [ 780, 0.145,  1200, 0.132],
    'm1.xlarge'  : [1560, 0.290,  2400, 0.264],
    'm3.xlarge'  : [1716, 0.301,  2640, 0.275],
    'm3.2xlarge' : [3432, 0.602,  5280, 0.550],
    't1.micro'   : [  62, 0.006,   100, 0.007],
    'm2.xlarge'  : [1030, 0.158,  1550, 0.140],
    'm2.2xlarge' : [2060, 0.315,  3100, 0.280],
    'm2.4xlarge' : [4120, 0.630,  6200, 0.560],
    'c1.medium'  : [ 500, 0.105,   775, 0.100],
    'c1.xlarge'  : [2000, 0.420,  3100, 0.400],
    'cc1.4xlarge': [4060, 0.477,  6300, 0.477],
    'cc2.8xlarge': [5000, 0.571,  7670, 0.571],
    'cg1.4xlarge': [6830, 0.794, 10490, 0.794],
    'hi1.4xlarge': [7280, 1.101, 10960, 0.962],
    'hs1.8xlarge':[11213, 1.251, 16924, 1.091],
  },
  'us-west-1' : {
    'm1.small'   : [ 195, 0.045,  300, 0.040],
    'm1.medium'  : [ 390, 0.090,  600, 0.080],
    'm1.large'   : [ 780, 0.180, 1200, 0.160],
    'm1.xlarge'  : [1560, 0.360, 2400, 0.320],
    't1.micro'   : [  62, 0.014,  100, 0.014],
    'm2.xlarge'  : [1030, 0.228, 1550, 0.198],
    'm2.2xlarge' : [2060, 0.455, 3100, 0.396],
    'm2.4xlarge' : [4120, 0.910, 6200, 0.792],
    'c1.medium'  : [ 500, 0.128,  775, 0.120],
    'c1.xlarge'  : [2000, 0.510, 3100, 0.480],
  },
  'us-west-2' : {
    'm1.small'   : [ 195, 0.036,  300, 0.033],
    'm1.medium'  : [ 390, 0.073,  600, 0.066],
    'm1.large'   : [ 780, 0.145, 1200, 0.132],
    'm1.xlarge'  : [1560, 0.290, 2400, 0.264],
    't1.micro'   : [  62, 0.006,  100, 0.006],
    'm2.xlarge'  : [1030, 0.158, 1550, 0.140],
    'm2.2xlarge' : [2060, 0.315, 3100, 0.280],
    'm2.4xlarge' : [4120, 0.630, 6200, 0.560],
    'c1.medium'  : [ 500, 0.105,  775, 0.100],
    'c1.xlarge'  : [2000, 0.420, 3100, 0.400],
    'cc2.8xlarge': [5000, 0.571, 7670, 0.571],
  },
  'eu-west-1' : {
    'm1.small'   : [  195, 0.045,  300, 0.040],
    'm1.medium'  : [  390, 0.090,  600, 0.080],
    'm1.large'   : [  780, 0.180, 1200, 0.160],
    'm1.xlarge'  : [ 1560, 0.360, 2400, 0.320],
    't1.micro'   : [   62, 0.009,  100, 0.009],
    'm2.xlarge'  : [ 1030, 0.228, 1550, 0.198],
    'm2.2xlarge' : [ 2060, 0.455, 3100, 0.396],
    'm2.4xlarge' : [ 4120, 0.910, 6200, 0.792],
    'c1.medium'  : [  500, 0.128,  775, 0.120],
    'c1.xlarge'  : [ 2000, 0.510, 3100, 0.480],
    'cc2.8xlarge': [11060, 0.855,29530, 1.685],
    'cg1.4xlarge': [ 6830, 1.187,10490, 1.092],
    'hi1.4xlarge': [ 7280, 2.231,11587, 1.307],
  },
  'ap-southeast-1' : {
    'm1.small'  : [ 195, 0.045,  300, 0.040],
    'm1.medium' : [ 390, 0.090,  600, 0.080],
    'm1.large'  : [ 780, 0.180, 1200, 0.160],
    'm1.xlarge' : [1560, 0.360, 2400, 0.320],
    't1.micro'  : [  62, 0.009,  100, 0.009],
    'm2.xlarge' : [1030, 0.228, 1550, 0.198],
    'm2.2xlarge': [2060, 0.455, 3100, 0.396],
    'm2.4xlarge': [4120, 0.910, 6200, 0.792],
    'c1.medium' : [ 500, 0.128,  775, 0.120],
    'c1.xlarge' : [2000, 0.510, 3100, 0.480],
  },
  'ap-northeast-1' : {
    'm1.small'  : [ 205, 0.049,  315, 0.044],
    'm1.medium' : [ 410, 0.116,  630, 0.088],
    'm1.large'  : [1449, 0.195, 3024, 0.176],
    'm1.xlarge' : [2898, 0.390, 6048, 0.352],
    't1.micro'  : [  65, 0.019,  105, 0.013],
    'm2.xlarge' : [1683, 0.248, 3357, 0.215],
    'm2.2xlarge': [3366, 0.495, 6714, 0.430],
    'm2.4xlarge': [6732, 0.990,13428, 0.860],
    'c1.medium' : [ 530, 0.139,  814, 0.133],
    'c1.xlarge' : [4743, 0.556,10494, 0.532],
  },
  'ap-southeast-2' : {
    'm1.small'  : [ 195, 0.045,  300, 0.040],
    'm1.medium' : [ 390, 0.090,  600, 0.080],
    'm1.large'  : [ 780, 0.180, 1200, 0.160],
    'm1.xlarge' : [1560, 0.360, 2400, 0.320],
    't1.micro'  : [  62, 0.009,  100, 0.009],
    'm2.xlarge' : [1030, 0.228, 1550, 0.198],
    'm2.2xlarge': [2060, 0.455, 3100, 0.396],
    'm2.4xlarge': [4120, 0.910, 6200, 0.792],
    'c1.medium' : [ 500, 0.128,  775, 0.120],
    'c1.xlarge' : [2000, 0.510, 3100, 0.480],
  },
  'sa-east-1' : {
    'm1.small'  : [ 372.94, 0.050,  574, 0.041],
    'm1.medium' : [ 746,    0.095, 1148, 0.083],
    'm1.large'  : [1492,    0.190, 2295, 0.164],
    'm1.xlarge' : [2984,    0.380, 4590, 0.328],
    't1.micro'  : [  84,    0.013,  135, 0.013],
    'm2.xlarge' : [2160,    0.223, 3260, 0.193],
    'm2.2xlarge': [4320,    0.445, 6521, 0.386],
    'm2.4xlarge': [8640,    0.890,13041, 0.772],
    'c1.medium' : [ 747,    0.120, 1148, 0.113],
    'c1.xlarge' : [2984,    0.480, 4590, 0.452],
  },
};

function generateCSVForObject(obj) {
    var pairs = new Array();
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            var v = obj[k];
            if (v != null) {
                if (typeof v === 'object') {
                    pairs.push(generateCSVForObject(v));
                } else if (typeof v != 'function') {
                    pairs.push(v);
                }
            }
        }
    }
    return pairs.join(',');
}

function sortView(document, cols, list) {
    // cols is a list of column ids. The portion after the first. must
    // be the name of the corresponding attribute of the objects in +list.
    var sortField = null;
    var ascending = null;
    for (var i in cols) {
        var col = cols[i];
        if (document.getElementById(col) != null) {
            log("col=["+col+"]");
            var direction = document.getElementById(col).getAttribute("sortDirection");
        } else {
            log("col=["+col+"] (skipped)");
        }

        if (direction && direction != "natural") {
            ascending = (direction == "ascending");
            sortField = col.slice(col.indexOf(".")+1);
            log("sortField=[" + sortField + "]");
            break;
        }
    }

    if (sortField != null) {
        var sortFunc = function(a,b) {
            var aVal = eval("a." + sortField) || "";
            var bVal = eval("b." + sortField) || "";
            var aF = parseFloat(aVal);
            // Check that:
            // 1. aF is a number
            // 2. aVal isn't a string that starts with a number
            //    eg. 123ABCD
            if (!isNaN(aF) &&
                aF.toString() == aVal) {
                // These are numbers
                aVal = aF;
                bVal = parseFloat(bVal);
            } else {
                aVal = aVal.toString().toLowerCase();
                bVal = bVal.toString().toLowerCase();
            }
            if (aVal < bVal) return ascending?-1:1;
            if (aVal > bVal) return ascending?1:-1;
            return 0;
        };
        list.sort(sortFunc);
    }
}

function cycleHeader(col, document, columnIdList, list) {
    var csd = col.element.getAttribute("sortDirection");
    var sortDirection = (csd == "ascending" || csd == "natural") ? "descending" : "ascending";
    for (var i = 0; i < col.columns.count; i++) {
        col.columns.getColumnAt(i).element.setAttribute("sortDirection", "natural");
    }
    col.element.setAttribute("sortDirection", sortDirection);
    sortView(document, columnIdList, list);
}

function getNodeValueByName(parent, nodeName) {
    var node = parent.getElementsByTagName(nodeName)[0];
    if (node == null) return "";
    return node.firstChild ? node.firstChild.nodeValue : "";
}

function methodPointer(obj, method) {
     var wrap = function(x) { obj.method(x); }
}

function trim(s) {
    return s.replace(/^\s*/, '').replace(/\s*$/, '');
}

function getProperty(name, defValue) {
    try {
        return document.getElementById('ec2ui.properties.bundle').getString(name);
    } catch(e) {
        return defValue;
    }
}

function log(msg) {
    this.consoleService = null;
    try {
        if (ec2ui_prefs.isDebugEnabled()) {
            if (this.consoleService == null) {
                this.consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
            }
            this.consoleService.logStringMessage("[ec2ui] " + msg);
        }
    } catch (e) {
    }
}

function copyToClipboard(text) {
    this.str = null;
    this.trans = null;
    this.clip = null;

    if (this.str == null) {
        this.str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
    }
    this.str.data = text;

    if (this.trans == null) {
        this.trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    }
    this.trans.addDataFlavor("text/unicode");
    this.trans.setTransferData("text/unicode", this.str, text.length * 2);

    var clipid = Components.interfaces.nsIClipboard;

    if (this.clip == null) {
        this.clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
    }
    clip.setData(this.trans,null,clipid.kGlobalClipboard);
}

// With thanks to http://delete.me.uk/2005/03/iso8601.html
Date.prototype.setISO8601 = function (string) {
   var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" + "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" + "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
   var d = string.match(new RegExp(regexp));
   if (d == null) {
      this.setTime(null);
      return;
   }
   var offset = 0; var date = new Date(d[1], 0, 1);
   if (d[3]) {
      date.setMonth(d[3] - 1);
   }
   if (d[5]) {
      date.setDate(d[5]);
   }
   if (d[7]) {
      date.setHours(d[7]);
   }
   if (d[8]) {
      date.setMinutes(d[8]);
   }
   if (d[10]) {
      date.setSeconds(d[10]);
   }
   if (d[12]) {
      date.setMilliseconds(Number("0." + d[12]) * 1000);
   }
   if (d[14]) {
      offset = (Number(d[16]) * 60) + Number(d[17]);
      offset *= ((d[15] == '-') ? 1 : -1);
   }
   offset -= date.getTimezoneOffset();
   var time = (Number(date) + (offset * 60 * 1000));
   this.setTime(Number(time));
}

// Poor-man's tokeniser.
// Splits a string into tokens on spaces.
// Spaces are ignored for strings wrapped in " or '.
// To insert a " or ', wrap inside ' or ", respectively.
//   "a b" c'd e'f => [a b,cd ef]
//   "c'd" => [c'd]
function tokenise(s) {
    var tokens = [];
    var sep = ' ';
    var tok = '';

    for(var i = 0; i < s.length; i++) {
        var ch = s[i];
        if (ch == sep) {
            if (sep == ' ') {
                if (tok.length > 0) { tokens.push(tok); }
                tok = '';
            } else {
                sep = ' ';
            }
        } else if (sep == ' ' && (ch == '"' || ch == "'")) {
            sep = ch;
        } else {
            tok += ch;
        }
    }

    if (tok.length > 0) { tokens.push(tok); }

    return tokens;
}

Date.prototype.toISO8601String = function (format, offset) {
    /* accepted values for the format [1-6]:
       1 Year:
       YYYY (eg 1997)
       2 Year and month:
       YYYY-MM (eg 1997-07)
       3 Complete date:
       YYYY-MM-DD (eg 1997-07-16)
       4 Complete date plus hours and minutes:
       YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
       5 Complete date plus hours, minutes and seconds:
       YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
       6 Complete date plus hours, minutes, seconds and a decimal
       fraction of a second
       YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
     */
    if (!format) { var format = 6; }
    if (!offset) {
        var offset = 'Z';
        var date = this;
    } else {
        var d = offset.match(/([-+])([0-9]{2}):([0-9]{2})/);
        var offsetnum = (Number(d[2]) * 60) + Number(d[3]);
        offsetnum *= ((d[1] == '-') ? -1 : 1);
        var date = new Date(Number(Number(this) + (offsetnum * 60000)));
    }

    var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }

    var str = "";
    str += date.getUTCFullYear();
    if (format > 1) { str += "-" + zeropad(date.getUTCMonth() + 1); }
    if (format > 2) { str += "-" + zeropad(date.getUTCDate()); }
    if (format > 3) {
        str += "T" + zeropad(date.getUTCHours()) +
            ":" + zeropad(date.getUTCMinutes());
    }
    if (format > 5) {
        var secs = Number(date.getUTCSeconds() + "." +
            ((date.getUTCMilliseconds() < 100) ? '0' : '') +
            zeropad(date.getUTCMilliseconds()));
        str += ":" + zeropad(secs);
    } else if (format > 4) { str += ":" + zeropad(date.getUTCSeconds()); }

    if (format > 3) { str += offset; }
    return str;
}

function generateS3Policy(bucket, prefix, validity) {
    var EC2_CANNED_ACL = "ec2-bundle-read";
    var validHours = 24;
    var expiry = new Date();
    if (validity != null) {
        validHours = validity;
    }
    expiry.setTime(expiry.getTime() + validHours * 60 * 60 * 1000);

    var expiryStr = expiry.toISO8601String(5);

    return (policyStr = '{' +
        '"expiration": "' + expiryStr + '",' +
        '"conditions": [' +
        '{"bucket": "' + bucket + '"},' +
        '{"acl": "' + EC2_CANNED_ACL + '"},' +
        '["starts-with", "$key", "' + prefix + '"]' +
        ']}');
}

function toByteArray(str) {
    var bArray = new Array();

    for (var i = 0; i < str.length; ++i) {
        bArray.push(str.charCodeAt(i));
    }

    return bArray;
}

function byteArrayToString(arr) {
    return eval("String.fromCharCode(" + arr.join(",") + ")");
}

function sleep(msecs) {
    var start = new Date().getTime();

    while (true) {
        if ((new Date().getTime() - start) > msecs) {
            break;
        }
    }
}

function tagResource(res, session, attr) {
    if (!attr) attr = "id";
    var tag = prompt("Tag " + res[attr] + " with? (To untag, just clear the string)",
                     res.tag || "");
    if (tag == null)
        return;

    res.tag = tag.trim();
    session.setResourceTag(res[attr], res.tag);
}

function __tagPrompt__(tag, allowEmpty) {
    var returnValue = {accepted:false , result:null};

    openDialog('chrome://ec2ui/content/dialog_tag.xul',
        null,
        'chrome,centerscreen,modal,width=400,height=250',
        tag,
        returnValue,
        allowEmpty);

    return returnValue.accepted ? (returnValue.result || '').trim() : null;
}

function tagEC2Resource(res, session, attr) {
    if (!attr) attr = "id";

    var tag = __tagPrompt__(res.tag);

    if (tag == null)
        return;

    tag = tag.trim();
    res.tag = tag;
    __addNameTagToModel__(tag, res);
    session.setResourceTag(res[attr], res.tag);

    __tagging2ec2__([res[attr]], session, tag);
}

function __tagging2ec2__(resIds, session, tagString, disableDeleteTags) {
  var multiIds = new Array();
  var multiTags = new Array();

  try {
        var tags = new Array();
        var emptyTags = new Array();
        tagString += ',';
        var keyValues = (tagString.match(/\s*[^,":]+\s*:\s*("(?:[^"]|"")*"|[^,]*)\s*,\s*/g) || []);

        for (var i = 0; i < keyValues.length; i++) {
            var kv = keyValues[i].split(/\s*:\s*/, 2);
            var key = (kv[0] || "").trim();
            var value = (kv[1] || "").trim();
            value = value.replace(/,\s*$/, '').trim();
            value = value.replace(/^"/, '').replace(/"$/, '').replace(/""/, '"');

            if (key.length != 0 && value.length == 0) {
                emptyTags.push(key);
            }

            if (key.length == 0 || value.length == 0) {
                continue;
            }

            tags.push([key, value]);
        }

        for (var i = 0; i < resIds.length; i++) {
            var resId = resIds[i];

            for (var j = 0; j < tags.length; j++) {
                multiIds.push(resId);
            }

            multiTags = multiTags.concat(tags);
        }

        if (multiIds.length == 0) {
            multiIds = resIds;
        }

        session.controller.describeTags(resIds, function(described) {
            var delResIds = new Array();
            var delKyes = new Array();

            for (var i = 0; i < described.length; i++) {
              delResIds.push(described[i][0]);
              delKyes.push(described[i][1]);
            }

            if (!disableDeleteTags) {
                if (delResIds.length > 0 && delKyes.length > 0) {
                    session.controller.deleteTags(delResIds, delKyes);
                }
            } else if (emptyTags.length > 0 && multiIds.length > 0) {
                session.controller.deleteTags(multiIds, emptyTags);
            }

            if (multiTags.length > 0) {
                session.controller.createTags(multiIds, multiTags);
            }
        });
    } catch (e) {
        alert(e);
    }
}

function __calcLinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcLinuxMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return null; }

  var amount = 0;

  for (var t in types) {
    var n = types[t];
    var rate = (rateSheet[t] || 0);
    amount += (Math.floor(rate * 1000) * n);
  }

  return amount * 24 * 30 / 1000;
}

function __calcWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return null; }

  var amount = 0;

  for (var t in types) {
    var n = types[t];
    var rate = (rateSheet[t] || 0);
    amount += (Math.floor(rate * 1000) * n);
  }

  return amount * 24 * 30 / 1000;
}

function __calcLightRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcLightRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcLightRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcLightRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcMediumRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcMediumRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcMediumRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcMediumRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcHeavyRILinuxMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcHeavyRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function __calcHeavyRIWindowsMonthlyAmount__(types, endpoint) {
  var rateSheet = __calcHeavyRIWindowsMonthlyAmount__rateSheets[endpoint];
  if (!rateSheet) { return [0, 0, 0, 0]; }

  var amounts = [0, 0, 0, 0];

  for (var t in types) {
    var n = types[t];
    var rates = (rateSheet[t] || [0, 0, 0, 0]);
    amounts[0] += (Math.floor(rates[0] * 1000) * n)
    amounts[1] += (Math.floor(rates[1] * 1000) * n)
    amounts[2] += (Math.floor(rates[2] * 1000) * n)
    amounts[3] += (Math.floor(rates[3] * 1000) * n)
  }

  return [amounts[0] / 1000, amounts[1] * 24 * 30 / 1000, amounts[2] / 1000, amounts[3] * 24 * 30 / 1000];
}

function parseHeaders(headers) {
    var headerArr = new Array();
    var arr = headers.split("\n");
    for(var i = 0; i < arr.length; i++){
        var header = arr[i];
        var parts = header.split(":");
        headerArr[parts[0]] = parts[1];
    }
    return headerArr;
}

function isWindows(platform) {
    return platform.match(ec2ui_utils.winRegex);
}

function isEbsRootDeviceType(rootDeviceType) {
    return (rootDeviceType == 'ebs');
}

function isVpc(instance) {
    return !!instance.vpcId;
}

function secondsToDays(secs) {
    var dur = parseInt(secs);
    // duration is provided in seconds. Let's convert it to years
    dur = Math.floor(dur/(60*60*24));
    return dur.toString();
}

function secondsToYears(secs) {
    var dur = parseInt(secondsToDays(secs));
    // duration is provided in days. Let's convert it to years
    dur = dur/(365);
    return dur.toString();
}

function __addNameTagToModel__(tag, model) {
    var kvs = tag.split(/\s*,\s*/);

    if (!model instanceof AMI) {
        model.name = '';
    }

    model.comment = '';

    for (var i = 0; i < kvs.length; i++) {
        var kv = kvs[i].split(/\s*:\s*/, 2);
        var key = kv[0].trim();
        var value = (kv[1] || "").trim();

        if (key == "Name") {
            value = (value || '').trim();

            if (value) {
                model.name = value;
            }
        }

        if (key == "Comment") {
            model.comment = value;
        }
    }
}

function __addCommentTagToModel__(tag, model) {
    var kvs = tag.split(/\s*,\s*/);

    for (var i = 0; i < kvs.length; i++) {
        var kv = kvs[i].split(/\s*:\s*/, 2);
        var key = kv[0].trim();
        var value = (kv[1] || "").trim();

        if (key == "Comment") {
            model.comment = value;
            return;
        }
    }
}

function __tagToName__(tag) {
    var kvs = (tag || '').split(/\s*,\s*/);

    for (var i = 0; i < kvs.length; i++) {
        var kv = kvs[i].split(/\s*:\s*/, 2);
        var key = kv[0].trim();
        var value = (kv[1] || "").trim();

        if (key == "Name") {
            return value;
        }
    }

    return null;
}

function __concatTags__(a, b) {
    if (!a) { a = ""; }
    if (!b) { b = ""; }

    function putTagsToHash(tagString, hash) {
        tagString += ',';
        var kvs = (tagString.match(/\s*[^,":]+\s*:\s*("(?:[^"]|"")*"|[^,]*)\s*,\s*/g) || []);

        for (var i = 0; i < kvs.length; i++) {
            var kv = kvs[i].split(/\s*:\s*/, 2);
            var key = kv[0].trim();
            var value = (kv[1] || "").trim();
            value = value.replace(/,\s*$/, '').trim();
            value = value.replace(/^"/, '').replace(/"$/, '').replace(/""/, '"');

            if (key && value) {
                if (/[,"]/.test(value)) {
                    value = value.replace(/"/g, '""');
                    value = '"' + value + '"';
                }

                hash[key] = value;
            } else if (key && !value) {
                hash[key] = null;
            }
        }
    }

    var tags = new Object();
    var tagArray = new Array();

    putTagsToHash(a, tags);
    putTagsToHash(b, tags);

    for (var i in tags) {
        if (tags[i]) {
            tagArray.push(i + ":" + tags[i]);
        }
    }

    return tagArray.join(", ");
}

var protPortMap = {
    ssh : "22",
    rdp : "3389",
    http: "80",
    https: "443",
    pop3 : "110",
    imap : "143",
    spop : "995",
    simap : "993",
    dns : "53",
    mysql : "3306",
    mssql : "1433",
    smtp : "25",
    smtps : "465",
    ldap : "389",
};

var fileCopyStatus = {
    FAILURE : 0,
    SUCCESS : 1,
    FILE_EXISTS : 2,
};

var regExs = {
    "ami" : new RegExp("^ami-[0-9a-f]{8}$"),
    "aki" : new RegExp("^aki-[0-9a-f]{8}$"),
    "ari" : new RegExp("^ari-[0-9a-f]{8}$"),
    "all" : new RegExp("^a[kmr]i-[0-9a-f]{8}$")
};

// ec2ui_utils is akin to a static class
var ec2ui_utils = {

    tagMultipleResources : function(list, session, attr) {
        if (!list || !session) return;

        if (!attr) {
            attr = "id";
        }

        var tag = __tagPrompt__(list[0].tag);

        if (tag == null) return;

        var res = null;
        tag = tag.trim();
        for (var i = 0; i < list.length; ++i) {
            res = list[i];
            res.tag = tag;
            session.setResourceTag(res[attr], res.tag);
        }
    },

    tagMultipleEC2Resources : function(list, session, attr) {
        if (!list || !session) return;

        if (!attr) {
            attr = "id";
        }

        var tag = __tagPrompt__(list[0].tag, true);

        if (!tag) return;

        var res = null;
        tag = tag.trim();
        var resIds = new Array();
        for (var i = 0; i < list.length; ++i) {
            res = list[i];
            res.tag = __concatTags__(res.tag, tag);
            __addNameTagToModel__(res.tag, res);
            session.setResourceTag(res[attr], res.tag);
            resIds.push(res[attr]);
        }

        __tagging2ec2__(resIds, session, tag, true);
    },

    winRegex : new RegExp(/^Windows/i),
    macRegex : new RegExp(/^Mac/),

    determineRegionFromString : function(str) {
        var region = "US-EAST-1";
        if (!str) {
            return region;
        }

        str = str.toLowerCase();
        // If str starts with:
        // us-east-1: region is US-EAST-1
        // us-west-1: region is US-WEST-1
        // eu-west-1: region is EU-WEST-1
        if (str.indexOf("us-west-1") >= 0) {
            region = "US-WEST-1";
        } else if (str.indexOf("us-west-2") >= 0) {
            region = "US-WEST-2";
        } else if (str.indexOf("eu-west-1") >= 0 || str == "eu") {
            region = "EU-WEST-1";
        } else if (str.indexOf("ap-southeast-1")) {
            region = "AP-SOUTHEAST-1";
        } else if (str.indexOf("ap-southeast-2")) {
            region = "AP-SOUTHEAST-2";
        } else if (str.indexOf("ap-northeast-1")) {
            region = "AP-NORTHEAST-1";
        } else if (str.indexOf("sa-east-1")) {
            region = "SA-EAST-1";
        }

        return region;
    },
    getMessageProperty : function(key, replacements) {
        if ( !this._stringBundle ) {
            const BUNDLE_SVC = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService);
            this._stringBundle = BUNDLE_SVC.createBundle("chrome://ec2ui/locale/ec2ui.properties");
        }
        try {
            if ( !replacements )
                return this._stringBundle.GetStringFromName(key);
            else
                return this._stringBundle.formatStringFromName(key, replacements, replacements.length);
        } catch(e) {
            return "";
        }
    },
};
